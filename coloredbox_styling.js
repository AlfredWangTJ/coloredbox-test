(function()  {
//自定义微件实现函数，该函数加载时自动调用，会创建一个自定义DOM元素com-sap-sample-coloredbox（名称与coloredbox.json中的webcomponents[n].tag相同），同时将其与ColoredBox类进行关联
	let template = document.createElement("template");  //Styling面板的HTML模板
	template.innerHTML = `
		<form id="form">  //创建输入表单
			<fieldset>
				<legend>Colored Box Properties</legend>
				<table>
					<tr>
						<td>Color</td>
						<td><input id="styling_color" type="text" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
	`;

	class ColoredBoxStylingPanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
//为表单添加submit事件监听器，当接收到submit事件时，会执行下方定义的事件处理器_submit()函数，同时使用bind()将this（指代当前的自定义元素ColoredBoxStylingPanel）绑定到_submit()函数，其效果为：在_submit()函数内部，使用this将指代ColoredBoxStylingPanel
		}

		_submit(e) {
			e.preventDefault();  
//阻止submit事件的默认处理方式，即阻止将输入表单中的数据提交至服务器端
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
//触发自定义事件propertiesChanged，用于通知coloredbox.js微件属性的变更，同时该自定义事件携带一个JSON对象，用于保存哪些属性进行了更改，propertiesChanged事件会触发coloredbox.js中的onCustomWidgetBeforeUpdate(oChangedProperties)以及onCustomWidgetAfterUpdate(oChangedProperties)函数的执行
					detail: {
						properties: {
							color: this.color  
//this.color会隐性调用ColoredBoxStylingPanel的color属性的getter方法，即下方的get color()
						}
					}
			}));
		}

		set color(newColor) {
//ColoredBoxStylingPanel的color属性的setter方法，由SAC的微件框架控制，当用户在Styling Pannel设置Color值时，或微件初始化设置属性的默认值时，会自动调用该方法
			this._shadowRoot.getElementById("styling_color").value = newColor;
		}

		get color() {  
//ColoredBoxStylingPanel的color属性的getter方法，由SAC的微件框架控制，当上方的_submit(e)函数中使用this.color时会自动调用该方法
			return this._shadowRoot.getElementById("styling_color").value;
		}
	}

customElements.define("com-sap-sample-coloredbox-styling", ColoredBoxStylingPanel);
