if(Meteor.isServer) return EventSelectorBlazeReact = {}; //so server side rendering isn't broken

EventSelectorBlazeReact = {
		nodes: {},
	
    componentDidMount() {
			EventSelectorBlazeReact.nodes[this._reactId()] = this;
			this.bindEvents();
    },
    componentWillUnmount() {
			delete EventSelectorBlazeReact.nodes[this._reactId()];		
			this.unbindEvents();
    },
		componentDidUpdate() {
			this.unbindEvents();
	    this.bindEvents();
	  },
		
		
		bindEvents() {
			_.each(this.events(), (handler, key) => {
				let [event, selector] = this._eventAndSelector(key);
				let $el = $(selector, ReactDOM.findDOMNode(this));
				let self = this;
				
        $el.bind(event+'.'+this._reactId(), function(e) {
					let data = self._findParentData($(this));
					handler.apply(data, [e]); 	
        });
			});
	  },
		unbindEvents() {
			let $el = $(ReactDOM.findDOMNode(this));
			$el.unbind('.'+this._reactId());
		},
		
		
		_findParentData($el) {
			return this.__findParentComponent($el).props.data;
		},
		
		//designed just to find the actual component of plain elements, 
		//not ancestor components of current component. 
		_findParentComponent($el) {
			let reactId;
			
			while($el.length !== 0) {
				reactId = $el.data('reactid');
				let component = EventSelectorBlazeReact.nodes[reactId];
				let isSkipped = component.fromHandlebars; //true data ctx only on non-handlebars components
				
				if(component && !isSkipped) return component; //component exists for reactId
				else $el = $el.parent('[data-reactid]'); //reactId corresponds to non-component element; find parent instead
			};
		},
		
		
		_eventAndSelector(key) {
			return key.trim().split(/\s(.+)?/);
		},
	 	_isEvent(method, name) {
			return this._eventsRegex.test(name) && _.isFunction(method);
		},	
		events() {
			return _.filterObject(Object.getPrototypeOf(this), this._isEvent);
		},
		_reactId() {
			return this._reactInternalInstance && this._reactInternalInstance._rootNodeID;
		},
		_eventsRegex: /^(click|dblclick|focus|blur|change|mouseenter|mouseleave|mousedown|mouseup|keydown|keypress|keyup|touchdown|touchmove|touchup)(\s|$)/
};