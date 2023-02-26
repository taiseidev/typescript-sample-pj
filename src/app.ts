class ProjectInput {
  templateElement: HTMLTemplateElement;
  // 親要素（<div id="app"></div>）
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // this.templateElement.contentでtemplateタグの内側にある要素を取得
    // importNodeの第二引数にはbool値を指定する（deep cloneするかどうか）
    // trueにすることによって最初の階層だけでなくtemplatem下の全ての要素を取得することができる
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.attach();
  }

  // hostElementに要素を追加する
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
