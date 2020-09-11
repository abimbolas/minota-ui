import { Note, Notepoint, Noteline, Noteplane, Notespace } from '@/models'

export default {
  computed: {
    itemType () {
      if (this.item instanceof Notespace) {
        return 'space'
      } else if (this.item instanceof Noteplane) {
        return 'plane'
      } else if (this.item instanceof Noteline) {
        return 'line'
      } else if (this.item instanceof Notepoint) {
        return 'point'
      } else if (this.item instanceof Note) {
        return 'note'
      }
    }
  }
}
