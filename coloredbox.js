(function() {  
//自定义微件实现函数，该函数加载时自动调用，会创建一个自定义DOM元素com-sap-sample-coloredbox（名称与coloredbox.json中的webcomponents[n].tag相同），同时将其与ColoredBox类进行关联
	let template = document.createElement("template");  //微件本身的HTML模板
	template.innerHTML = `
		<style>
		:host {  //host伪元素用来获取shadow DOM的Root根节点
			border-radius: 25px;
			border-width: 4px;
			border-color: black;
			border-style: solid;
			display: block;
		}
		</style>
	`;

	class ColoredBox extends HTMLElement {  //自定义微件的JavaScript API
		constructor() {  
//构造器，仅会触发一次，当微件被添加到App Designer/Story 2.0时触发
			super();  //必须调用
			let shadowRoot = this.attachShadow({mode: "open"});  //创建shadow DOM的Root根节点
			shadowRoot.appendChild(template.content.cloneNode(true));  //将HTML模板中的内容拷贝并添加到shadow DOM根节点下
			this.addEventListener("click", event => {  
//为自定义微件添加HTML默认的Click事件的监听器，当监听到默认的Click事件时，则触发微件的自定义事件onClick（该事件需要与coloredbox.json中的events["<事件名称>"]相匹配）
				var event = new Event("onClick");  //创建自定义事件onClick
				this.dispatchEvent(event);  //触发自定义事件onClick
			});
			this._props = {};  //创建一个_props对象用于保存微件属性
		}

    connectedCallback(){}
//该方法为SAC微件框架自带方法，当微件被添加到HTML DOM时触发，或微件所在的页面/面板由隐藏状态调整为激活状态时也会触发，该方法每次都会触发。

    disconnectedCallback(){}
//该方法为SAC微件框架自带方法，与connectedCallback相反，当微件从HTML DOM中移除时触发，或微件所在的页面/面板被隐藏/关闭时也会触发，该方法每次都会触发。

		onCustomWidgetBeforeUpdate(oChangedProperties) {  
//该方法为SAC微件框架自带方法，在监听到自定义事件propertiesChanged后触发，当微件属性变更之前执行，多用于更新微件的属性
      console.log("coloredbox.js - onCustomWidgetBeforeUpdate");
      this.printVal();
			this._props = { ...this._props, ...oChangedProperties };  //将原有_props属性与修改的属性changedProperties进行合并，并覆盖更新原有_props属性
      this.printVal();
		}

		onCustomWidgetAfterUpdate(oChangedProperties) {
//该方法为SAC微件框架自带方法，在监听到自定义事件propertiesChanged后触发，当微件属性变更之后执行，多用于微件属性更新后，更改微件在页面上的显示样式
      console.log("coloredbox.js - onCustomWidgetAfterUpdate");
			if ("color" in oChangedProperties) {
				this.style["background-color"] = oChangedProperties["color"];
        this.color = oChangedProperties["color"];
//this.color = oChangedProperties["color"]隐式调用setter方法set color(newColor)
			}
			if ("opacity" in oChangedProperties) {
				this.style["opacity"] = oChangedProperties["opacity"];
			}
		}
	}

    onCustomWidgetDestroy(){}
//该方法为SAC微件框架自带方法，与constructor相反，仅会触发一次，当微件从App Designer/Story 2.0画布移除时触发，或Application/Story 2.0被关闭时触发

    onCustomWidgetResize(width, height){}
//该方法为SAC微件框架自带方法，当微件处于激活状态且大小被调整时触发，当微件被隐藏时不会触发。使用该方法会导致SAC检测DOM的大小，会占用额外的性能，故当不需要该方法时，需要将其注释掉

    getColor(){  
//在coloredbox.json中methods["getColor"]未定义body，需要在coloredbox.js中对其进行补充，定义其函数体代码
      console.log("coloredbox.js - getColor");
      return this.color;  //this.color隐式调用getter方法get color()
}
    set color(newColor){  //ColoredBox的color属性的setter方法，供隐式调用
      console.log("coloredbox.js - setter");
      this._props["color"] = newColor;
}
    get color(){  //ColoredBox的color属性的getter方法，供隐式调用
      console.log("coloredbox.js - getter");
      return this._props["color"];
}

    printVal(){  //打印属性值
      console.log("coloredbox.js - printVal");
      console.log(this._props);
      console.log(${this._props["color"]});  //在控制台打印_props属性中的color子属性
      console.log(${this._props["widgetName"]});  //在控制台打印_props属性中的微件名称子属性
      console.log(this.color);
}

	customElements.define("com-sap-sample-coloredbox", ColoredBox);
})();
