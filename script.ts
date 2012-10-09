/// <reference path="jquery.d.ts" />

class MemoPadView {
  textarea:any;
  saveButton:any;
  clearButton:any;

	constructor (model:MemoPadModel, controller:MemoPadController, ui:any) {
		var self = this;
		this.textarea = $(ui.textarea);
		this.saveButton = $(ui.saveButton);
		this.saveButton.on('click', function() {
			controller.save(self.textarea.val());
		});
		this.clearButton = $(ui.clearButton);
		this.clearButton.on('click', function() {
			controller.clear();
		});

		this.render(model.getData());

		model.addEventListener('updated', function(event) {
			self.render(event.value);
		});

		model.addEventListener('cleared', function(event) {
			self.render('');
		});
	}

	render (value:string) {
		this.textarea.val(value);
	}
}

class EventDispatcher {
	dispatcher:any;

	constructor () {
		this.dispatcher = $({});
	}

	addEventListener(type:string, listener:any) {
		this.dispatcher.on.apply(this.dispatcher, arguments);
	}

	removeEventListener(type:string) {
		this.dispatcher.off.apply(this.dispatcher, arguments);
	}

	dispatchEvent(event) {
		this.dispatcher.trigger.apply(this.dispatcher, arguments);
	}
}

class MemoPadModel extends EventDispatcher {
	namespace:string;

	constructor (namespace:string) {
		localStorage.setItem(namespace, localStorage.getItem(namespace) || '');
		this.namespace = namespace;

		super();
	}

	getData() {
		return localStorage.getItem(this.namespace);
	}

	update(value:any) {
		localStorage.setItem(this.namespace, value);
		this.dispatchEvent({type:'updated', value:value});
	}

	destroy() {
		this.dispatchEvent({type:'cleared'});
		localStorage.setItem(this.namespace, '');
	}
}

class MemoPadController {
	model:MemoPadModel;

	constructor(model:MemoPadModel) {
		this.model = model;
	}

	clear() {
		this.model.destroy();
	}

	save(value:string) {
		this.model.update(value);
	}
}

class App {
	constructor(ui:any) {
		var model:MemoPadModel = new MemoPadModel('MemoPadApp');
		var controller:MemoPadController = new MemoPadController(model);
		var view:MemoPadView = new MemoPadView(model, controller, ui);
	}
}

var ui = {
	textarea:'#memoArea',
	saveButton:'#saveButton',
	clearButton:'#clearButton'
}

$(function() {
	var app = new App(ui);    
});