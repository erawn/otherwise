import { NotebookPanel, Notebook } from '@jupyterlab/notebook';
import { Kernel, Session } from '@jupyterlab/services';
import { PromiseDelegate } from '@lumino/coreutils';
import { PathExt } from '@jupyterlab/coreutils';
import { Signal, ISignal } from '@lumino/signaling';


import CellAPI from './cell';

export class NotebookAPI {
  private readonly _ready: PromiseDelegate<void>;
  private _changed = new Signal<this, string>(this);

  panel: NotebookPanel;
  kernel: Kernel.IKernelConnection;
  cells: CellAPI[];

  constructor(notebookPanel: NotebookPanel) {
    this.panel = notebookPanel;
    this.listenToSession();
    this.listenToKernel();

    this._ready = new PromiseDelegate<void>();
    this.panel.revealed.then(() => {
      this.listenToCells();
      this._ready.resolve();
    });
  }

  /*
  * Here are some events that you can signal to other parts of your app
  */

  // ready is a Promise that resolves once the notebook is done loading
  get ready(): Promise<void> {
    return this._ready.promise;
  }

  // changed is a signal emitted when various things in this notebook change
  get changed(): ISignal<NotebookAPI, string> {
    return this._changed;
  }


  /*
  * Here are a bunch of utility functions to get useful information about
  * the user's current notebook
  */

  get notebook(): Notebook {
    return this.panel.content;
  }

  get language(): string{
    let meta = this.notebook.model?.metadata
    if(meta.has("language_info")){
      let val = this.notebook.model.metadata.get("language_info").valueOf()
      if(val instanceof Object)
        return val['name']
    }
  }

  get path(): string {
    return this.panel.sessionContext.path;
  }

  get name(): string {
    return PathExt.basename(this.path);
  }

  get activeCell() {
    return this.cells.find(
      cell => cell.model.id === this.notebook.activeCell.model.id
    );
  }

  addCell(kind: 'code'| 'markdown', text: string, index: number){
    let cell;
    if(kind ==='code')
      cell = this.notebook.model.contentFactory.createCodeCell({})
    else
      cell = this.notebook.model.contentFactory.createMarkdownCell({})
    cell.value.text = text
    this.notebook.model.cells.insert(index, cell)
  }

  /*
  * Various notebook level events you can listen to
  */

  private listenToCells() {
    this.loadCells();

    // event fires when cells are added, deleted, or moved
    this.notebook.model.cells.changed.connect(() => {
      this.loadCells();
      this._changed.emit('cells');
    });

    // event fires when the user selects a cell
    this.notebook.activeCellChanged.connect(() => {
      this._changed.emit('activeCell');
    });
  }

  private listenToSession() {
    // event fires when the user moves or renames their notebook
    this.panel.sessionContext.propertyChanged.connect((_, prop) => {
      if (prop === 'path') this._changed.emit('path');
      if (prop === 'name') this._changed.emit('name');
    });
  }

  private listenToKernel() {
    // event fires when the current kernel is changed
    this.panel.sessionContext.kernelChanged.connect(
      (_, args: Session.ISessionConnection.IKernelChangedArgs) => {
        this.kernel = args.newValue;
      }
    );
  }

  private loadCells() {
    this.cells = [];
    for (let i = 0; i < this.notebook.model.cells.length; i++)
      this.cells.push(new CellAPI(this.notebook.model.cells.get(i), i));
  }
}
