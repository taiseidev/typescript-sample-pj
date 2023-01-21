// AutoBind decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
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

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
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

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      "#manday"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  @AutoBind
  private submitHandler(event: Event) {
    // httpリクエストが送信されないようにする
    event.preventDefault();
    console.log(this.titleInputElement.value);
  }

  private configure() {
    // submitHandlerで使用しているthisはこのクラスを参照しているわけではないので
    // bindしないとundefinedになる。bind(this)でクラスのthisを渡すことによってsubmitHandler側でthisを参照することができる
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    // insertAdjacentElementの参考
    // https://syncer.jp/Web/API_Interface/Reference/IDL/Element/insertAdjacentElement/
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
