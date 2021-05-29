/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import notebook from '@/domain/user/notebook';
import { Note } from '@/domain/user/note';

describe('Notebook', () => {
  beforeEach(() => {
    notebook.state = {
      notes: '1234567'.split('').map(() => new Note()),
      table: []
    };
  });

  it('can add and remove notes from table', () => {
    expect(notebook.state.table.length).to.equal(0);
    notebook.mutations.addToTable(notebook.state, notebook.state.notes[3]);
    expect(notebook.state.table.length).to.equal(1);
    notebook.mutations.removeFromTable(notebook.state, notebook.state.notes[5]);
    expect(notebook.state.table.length).to.equal(1);
    notebook.mutations.removeFromTable(notebook.state, notebook.state.notes[3]);
    expect(notebook.state.table.length).to.equal(0);
  });
});
