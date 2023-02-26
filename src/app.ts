// プロジェクトの要素を表示する
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
    // trueにすることによって最初の階層だけでなくtemplate下の全ての要素を取得することができる
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // user-inputというidを指定することによってcssを適用
    this.element.id = "user-input";
    this.attach();
  }

  // hostElementに要素追加して画面を表示するメソッド
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// インスタンス化してフォームを表示する
const prjInput = new ProjectInput();
