/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import { Table } from '@/domain/user/table'
import { Note } from '@/domain/user/note'

describe('Table', () => {
  let table = new Table()

  it('can contain notes', () => {
    expect(table).to.be.empty
    table.add(new Note())
    table.add(new Note())
    expect(table.size).to.equal(2)
  })
})
