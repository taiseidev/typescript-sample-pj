// Validation
// バリデーション用のインターフェース
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true; // デフォルトではtrue。なにかしらのバリデーションエラーの場合はfalseに変更

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    // minLengthに0が設定されていた場合の対応
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid = isValid && validatableInput.value.length >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid = isValid && validatableInput.value.length <= validatableInput.max;
  }
  return isValid;
}

// AutoBind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// プロジェクトの要素を表示する
// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  // 親要素（<div id="app"></div>）
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

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

    // this.elementはFormでこの要素に対してquerySelectorを実行することによってその下の要素を取得することができる。
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      "#manday"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  // 各要素を取得してバリデーションチェック。完了したらタプル型で返却
  // 戻り値がない場合はundefinedではなくvoidを指定する
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredManday = this.mandayInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const mandayValidatable: Validatable = {
      value: +enteredManday,
      required: true,
      min: 1,
      max: 1000,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(mandayValidatable)
    ) {
      alert("入力値が正しくありません。再度お試しください。");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredManday];
    }
  }

  // submitされた時にフォームの内容をクリアする
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.mandayInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    // ↓このイベントからHTTPリクエストが送られないように設定
    event.preventDefault();
    // 入力内容を取得してタプル型で返却
    const userInput = this.gatherUserInput();
    // タプルは配列のため、配列かどうかのチェックを行っている
    // ランタイム上ではタプルか判別することができない
    if (Array.isArray(userInput)) {
      const [title, desc, manday] = userInput;
      console.log(title + desc + manday);
      this.clearInputs();
    }
  }

  // イベントリスナーの設定
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  // hostElementに要素追加して画面を表示するメソッド
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

// インスタンス化してフォームを表示する
const prjInput = new ProjectInput();
