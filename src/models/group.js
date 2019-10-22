/* eslint-disable brace-style */

import sortedIndexBy from 'lodash/sortedIndexBy'
import uuid from 'uuid/v1'
import GroupItemInterface from '@/models/group-item'
import { topicDelimiter } from '@/store/ui'

// Return item's sorting value to compare against.
// For sorting by date this should be some kind of item's date (number),
// for sorting by alphabet return some kind of item's title (string)
function defaultGetOrderedPosition (item) {
  return new Date(item.date).getTime()
}

// Return item's path in tree.
// Tree (nested items) can be flattened to plain list of nodes with paths. And vice versa,
// flat list of items can be assembled into tree, if for each item we can
// resolve it's path in this tree. For example, file path on drive is obviously
// file's path in drive logic tree. Book with deeply nested chapters is tree of
// chapters, for example 'some book / part 1 / chapter 2 / sub-chapter 6'.
function defaultGetPath (item) {
  return item.path
}

// Extract items from list of groups/notes
export function extractItems (list) {
  let items = []
  list.forEach(item => {
    if (item instanceof Group) {
      items = items.concat(item.getItems())
    } else {
      items.push(item)
    }
  })
  return items
}

export default class Group extends GroupItemInterface {
  constructor ({
    key = '',
    getPath = defaultGetPath,
    getOrderedPosition = defaultGetOrderedPosition,
    orderDirection = 1,
    parent = null
  } = {}) {
    super()
    this.id = uuid()
    this.key = key
    this.children = []
    this.options = {
      getPath: getPath,
      getOrderedPosition: getOrderedPosition,
      orderDirection
    }
    this.parent = parent
  }

  get fullGroup () {
    if (!this.leaf) {
      if (this.children.length === 1) {
        return this.children[0].fullGroup
      } else {
        return this
      }
    }
  }

  get leaf () {
    if (this.children.length === 1) {
      if (!(this.children[0] instanceof Group)) {
        return this.children[0]
      } else {
        return this.children[0].leaf
      }
    }
  }

  get context () {
    let depth = 0
    let item = this
    while (item instanceof Group) {
      item = item.children[0]
      depth = depth + 1
    }
    return item.topic.split(topicDelimiter).slice(0, -depth)
  }

  get path () {
    let path = []
    if (this.key) {
      path = path.concat(this.key)
    }
    if (this.parent) {
      path = this.parent.path.concat(path)
    }
    return path
  }

  batch (action, items, secondArgument, thirdArgument) {
    items.forEach(item => this[action](item, secondArgument, thirdArgument))
  }

  // Public method of add item to tree
  addItem (item, depth = 0) {
    // Get item's path in tree
    const path = this.options.getPath(item)
    // Last inserted id will be used later for re-sorting
    let lastInsertedId

    // 1. At first, attempt to insert into existing child
    const existingChildId = this.children.findIndex(child => {
      return child.key && path[depth] && child.key === path[depth]
    })
    if (existingChildId > -1) {
      this.children[existingChildId].addItem(item, depth + 1)
    }
    // 2. If no corresponding child, and our meaningful path length is still > 0,
    // this means more deep nested position in tree, so we need proxy node
    else if (path.length > depth) {
      const proxy = new Group({
        key: path[depth],
        getPath: this.options.getPath,
        parent: this
      })
      // Add proxy to children, but important to first add our item to it,
      // because later we will need our item already inside proxy node
      // to calc proxy node's sorting position
      proxy.addItem(item, depth + 1) // 1
      lastInsertedId = this.addChild(proxy) // 2
    }
    // 3. If no child found and path is already finished, add item to tree.
    // Actually, this branch is exact place where we actually add items
    // to tree
    else {
      this.addChild(item)
    }
    // Re-sorting, as added item can change order position among children,
    // through re-adding just added item
    const refreshId = lastInsertedId || existingChildId
    if (refreshId > -1) {
      this.addChild(this.children.splice(refreshId, 1)[0])
    }
  }

  // Just plain add tree node to list of children, sorted.
  // Not for direct use, you need to make sure that item really belong to
  // your children - this is what .addItem method is for.
  addChild (child) {
    // Make sure no duplicated exist
    if (this.children.indexOf(child) < 0) {
      // const previousVersionId = this.children.findIndex(existing => {
      //   return (existing.id || existing.config.id) === child.id
      // })
      // if (previousVersionId > -1) {
      //   this.children.splice(previousVersionId, 1)
      // }
      const id = sortedIndexBy(this.children, child, item => {
        return this.getOrderedPosition(item)
      })
      this.children.splice(id, 0, child)
    } else {
      const content = `Add child to group: duplicate in ${this.path()}`
      console.warn(content, child)
      // bus.$emit('toast', { content, type: 'error' })
    }
  }

  removeItem (item) {
    const id = this.children.findIndex(child => {
      return child.id === item.id
    })
    if (id > -1) {
      this.children.splice(id, 1)
    } else {
      // Search through grandchildren. Also delete empty children
      const empty = this.children.filter(child => {
        if (child instanceof Group) {
          child.removeItem(item)
          if (!child.children.length) {
            return true // save on empty list
          }
        }
      })
      // Remove empty
      empty.forEach(child => child.removeChild(child))
    }
    // Remove empty self
    if (!this.children.length && this.parent) {
      this.parent.removeChild(this)
    }
  }

  removeChild (child) {
    const id = this.children.indexOf(child)
    if (id > -1) {
      this.children.splice(id, 1)
    }
  }

  getItems () {
    return this.children.reduce((items, child) => {
      if (child instanceof Group) {
        return items.concat(child.getItems())
      } else {
        items.push(child)
        return items
      }
    }, [])
  }

  getOrderedPosition (child) {
    // We might have note or group. If we have group, calc it's position
    // based on orderDirection.
    if (child instanceof Group) {
      return this.getOrderedPosition(
        child.children[this.options.orderDirection > 0 ? 0 : child.children.length - 1]
      )
    }
    // Or if this is item itself, just get option's provided calc
    else {
      return this.options.orderDirection * this.options.getOrderedPosition(child)
    }
  }

  calcItemProp (getPropValueFn, lowerBound = false) {
    return this.children.reduce((propValue, child, index) => {
      // If child is not Group, extract it's prop value with provided Fn.
      // If child is Group, extract it's prop value recursively.
      let childPropValue
      if (child instanceof Group) {
        childPropValue = child.calcItemProp(getPropValueFn, lowerBound)
      } else {
        childPropValue = getPropValueFn(child)
      }
      // Decide, depending on lowerBound, which prop to take
      if (lowerBound) {
        return childPropValue > propValue ? propValue : childPropValue
      } else {
        return childPropValue < propValue ? propValue : childPropValue
      }
    }, this.children[0] instanceof Group
      ? this.children[0].calcItemProp(getPropValueFn, lowerBound)
      : getPropValueFn(this.children[0])
    )
  }

  // addChild (child) {
  //   if (this.children.indexOf(child) < 0) {
  //     const id = sortedIndexBy(
  //       this.children, child, item => -lastUpdated(item))
  //     this.children.splice(id, 0, child)
  //   } else {
  //     const content = `Add child to group: duplicate in ${this.path()}`
  //     console.warn(content, child)
  //     bus.$emit('toast', { content, type: 'error' })
  //   }
  // }

  // // Добавляем запись (оборачивая в узел)
  // addItem (entry, depth = 0, resolvePath) {
  //   // Нужно получить путь записи
  //   const path = resolvePath ? resolvePath(entry) : this.resolvePath(entry)
  //   // Айди последнего добавленного
  //   let lastInsertedId
  //   // Пытаемся вставить в уже существующего ребёнка
  //   const childIndex = this.children
  //     .findIndex(item => {
  //       return item.name === path[depth] &&
  //         item.name &&
  //         path[depth]
  //     })
  //   if (childIndex > -1) {
  //     this.children[childIndex].addItem(entry, depth + 1, resolvePath)
  //   } else if (path.length > depth) {
  //     // Более глубокое залегание,
  //     // создаём прокси-узел
  //     const ExtendedGroup = safeGetAtIndex(
  //       depth,
  //       this.constructors)
  //     const proxy = new ExtendedGroup({
  //       resolvePath: this.resolvePath,
  //       name: path[depth],
  //       parent: this,
  //       constructors: this.constructors
  //     })
  //     proxy.addItem(entry, depth + 1, resolvePath) // 1
  //     lastInsertedId = this.addChild(proxy) // 2
  //   } else {
  //     // Финальное добавление с сортировкой
  //     this.addChild(entry)
  //   }
  //   // Пересортировочка
  //   this.refreshOrderPosition(lastInsertedId || childIndex)
  // }
  // // Удаляем запись рекурсивно и пустые узлы
  // // в результате образовавшиеся
  // removeItem (entry) {
  //   const id = this.children.findIndex(item => {
  //     return item.id === entry.id
  //   })
  //   if (id > -1) {
  //     this.children.splice(id, 1)
  //   } else {
  //     // Удалить и запомнить образовавшиеся
  //     // пустые группы
  //     const empty = this.children.filter(item => {
  //       if (item instanceof Group) {
  //         item.removeEntry(entry)
  //         // Дочерняя группа опустела?
  //         if (item.children.length === 0) {
  //           return true
  //         }
  //       }
  //       // Всё в порядке
  //       return false
  //     })
  //     // Удаляем пустые
  //     empty.forEach(child => this.removeChild(child))
  //   }
  // }
  //
  // removeChild (child) {
  //   const id = this.children.indexOf(child)
  //   if (id > -1) {
  //     this.children.splice(id, 1)
  //   }
  // }
}
