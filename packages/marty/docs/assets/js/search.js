var typedoc = typedoc || {};
            typedoc.search = typedoc.search || {};
            typedoc.search.data = {"kinds":{"4":"Enumeration","16":"Enumeration member","32":"Variable","128":"Class","256":"Interface","512":"Constructor","1024":"Property","2048":"Method","65536":"Type literal"},"rows":[{"id":0,"kind":32,"name":"EXIT","url":"globals.html#exit","classes":"tsd-kind-variable"},{"id":1,"kind":32,"name":"ENTER","url":"globals.html#enter","classes":"tsd-kind-variable"},{"id":2,"kind":32,"name":"TOP_STATE_NAME","url":"globals.html#top_state_name","classes":"tsd-kind-variable"},{"id":3,"kind":4,"name":"InstructionTypes","url":"enums/instructiontypes.html","classes":"tsd-kind-enum"},{"id":4,"kind":16,"name":"Event","url":"enums/instructiontypes.html#event","classes":"tsd-kind-enum-member tsd-parent-kind-enum","parent":"InstructionTypes"},{"id":5,"kind":16,"name":"Transition","url":"enums/instructiontypes.html#transition","classes":"tsd-kind-enum-member tsd-parent-kind-enum","parent":"InstructionTypes"},{"id":6,"kind":128,"name":"Instruction","url":"classes/instruction.html","classes":"tsd-kind-class"},{"id":7,"kind":512,"name":"constructor","url":"classes/instruction.html#constructor","classes":"tsd-kind-constructor tsd-parent-kind-class tsd-is-protected","parent":"Instruction"},{"id":8,"kind":1024,"name":"type","url":"classes/instruction.html#type","classes":"tsd-kind-property tsd-parent-kind-class","parent":"Instruction"},{"id":9,"kind":128,"name":"Event","url":"classes/event.html","classes":"tsd-kind-class"},{"id":10,"kind":512,"name":"constructor","url":"classes/event.html#constructor","classes":"tsd-kind-constructor tsd-parent-kind-class tsd-is-overwrite","parent":"Event"},{"id":11,"kind":1024,"name":"id","url":"classes/event.html#id","classes":"tsd-kind-property tsd-parent-kind-class","parent":"Event"},{"id":12,"kind":1024,"name":"payload","url":"classes/event.html#payload","classes":"tsd-kind-property tsd-parent-kind-class","parent":"Event"},{"id":13,"kind":2048,"name":"isInfrastructureEvent","url":"classes/event.html#isinfrastructureevent","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-static","parent":"Event"},{"id":14,"kind":2048,"name":"getInfrastructureEvents","url":"classes/event.html#getinfrastructureevents","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-static","parent":"Event"},{"id":15,"kind":1024,"name":"type","url":"classes/event.html#type","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-inherited","parent":"Event"},{"id":16,"kind":256,"name":"IEventHandler","url":"interfaces/ieventhandler.html","classes":"tsd-kind-interface"},{"id":17,"kind":2048,"name":"handle","url":"interfaces/ieventhandler.html#handle","classes":"tsd-kind-method tsd-parent-kind-interface","parent":"IEventHandler"},{"id":18,"kind":128,"name":"Transition","url":"classes/transition.html","classes":"tsd-kind-class"},{"id":19,"kind":512,"name":"constructor","url":"classes/transition.html#constructor","classes":"tsd-kind-constructor tsd-parent-kind-class tsd-is-overwrite","parent":"Transition"},{"id":20,"kind":1024,"name":"state","url":"classes/transition.html#state","classes":"tsd-kind-property tsd-parent-kind-class","parent":"Transition"},{"id":21,"kind":1024,"name":"type","url":"classes/transition.html#type","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-inherited","parent":"Transition"},{"id":22,"kind":128,"name":"StateMachine","url":"classes/statemachine.html","classes":"tsd-kind-class"},{"id":23,"kind":1024,"name":"_queueCapacity","url":"classes/statemachine.html#_queuecapacity","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":24,"kind":1024,"name":"_instructionQueue","url":"classes/statemachine.html#_instructionqueue","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":25,"kind":1024,"name":"_currentState","url":"classes/statemachine.html#_currentstate","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":26,"kind":1024,"name":"_topState","url":"classes/statemachine.html#_topstate","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":27,"kind":1024,"name":"_states","url":"classes/statemachine.html#_states","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":28,"kind":65536,"name":"__type","url":"classes/statemachine.html#_states.__type","classes":"tsd-kind-type-literal tsd-parent-kind-property","parent":"StateMachine._states"},{"id":29,"kind":1024,"name":"_events","url":"classes/statemachine.html#_events","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":30,"kind":1024,"name":"_stateMachines","url":"classes/statemachine.html#_statemachines","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":31,"kind":1024,"name":"_initialized","url":"classes/statemachine.html#_initialized","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":32,"kind":1024,"name":"_isBusy","url":"classes/statemachine.html#_isbusy","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":33,"kind":1024,"name":"_isResetting","url":"classes/statemachine.html#_isresetting","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":34,"kind":1024,"name":"_subject","url":"classes/statemachine.html#_subject","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":35,"kind":2048,"name":"getEvents","url":"classes/statemachine.html#getevents","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":36,"kind":512,"name":"constructor","url":"classes/statemachine.html#constructor","classes":"tsd-kind-constructor tsd-parent-kind-class tsd-is-protected","parent":"StateMachine"},{"id":37,"kind":2048,"name":"registerStates","url":"classes/statemachine.html#registerstates","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-protected","parent":"StateMachine"},{"id":38,"kind":2048,"name":"registerEvents","url":"classes/statemachine.html#registerevents","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-protected","parent":"StateMachine"},{"id":39,"kind":2048,"name":"registerStateMachines","url":"classes/statemachine.html#registerstatemachines","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-protected","parent":"StateMachine"},{"id":40,"kind":2048,"name":"initialize","url":"classes/statemachine.html#initialize","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":41,"kind":2048,"name":"isInitialized","url":"classes/statemachine.html#isinitialized","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":42,"kind":2048,"name":"reset","url":"classes/statemachine.html#reset","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":43,"kind":2048,"name":"handle","url":"classes/statemachine.html#handle","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":44,"kind":2048,"name":"transition","url":"classes/statemachine.html#transition","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":45,"kind":2048,"name":"setBusy","url":"classes/statemachine.html#setbusy","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":46,"kind":2048,"name":"setSubject","url":"classes/statemachine.html#setsubject","classes":"tsd-kind-method tsd-parent-kind-class","parent":"StateMachine"},{"id":47,"kind":2048,"name":"setCurrentState","url":"classes/statemachine.html#setcurrentstate","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":48,"kind":2048,"name":"doTransition","url":"classes/statemachine.html#dotransition","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":49,"kind":2048,"name":"queueInstruction","url":"classes/statemachine.html#queueinstruction","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":50,"kind":2048,"name":"transitionToParent","url":"classes/statemachine.html#transitiontoparent","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":51,"kind":2048,"name":"transitionToSibling","url":"classes/statemachine.html#transitiontosibling","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":52,"kind":2048,"name":"transitionToChild","url":"classes/statemachine.html#transitiontochild","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":53,"kind":2048,"name":"transitionToAncestor","url":"classes/statemachine.html#transitiontoancestor","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":54,"kind":2048,"name":"transitionToDescendant","url":"classes/statemachine.html#transitiontodescendant","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":55,"kind":2048,"name":"transitionToOther","url":"classes/statemachine.html#transitiontoother","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-private","parent":"StateMachine"},{"id":56,"kind":128,"name":"State","url":"classes/state.html","classes":"tsd-kind-class"},{"id":57,"kind":1024,"name":"name","url":"classes/state.html#name","classes":"tsd-kind-property tsd-parent-kind-class","parent":"State"},{"id":58,"kind":1024,"name":"canTransition","url":"classes/state.html#cantransition","classes":"tsd-kind-property tsd-parent-kind-class","parent":"State"},{"id":59,"kind":1024,"name":"parentState","url":"classes/state.html#parentstate","classes":"tsd-kind-property tsd-parent-kind-class","parent":"State"},{"id":60,"kind":1024,"name":"startState","url":"classes/state.html#startstate","classes":"tsd-kind-property tsd-parent-kind-class","parent":"State"},{"id":61,"kind":1024,"name":"_children","url":"classes/state.html#_children","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"State"},{"id":62,"kind":1024,"name":"_siblings","url":"classes/state.html#_siblings","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"State"},{"id":63,"kind":1024,"name":"_ancestors","url":"classes/state.html#_ancestors","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"State"},{"id":64,"kind":1024,"name":"_descendants","url":"classes/state.html#_descendants","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"State"},{"id":65,"kind":1024,"name":"_stateMachine","url":"classes/state.html#_statemachine","classes":"tsd-kind-property tsd-parent-kind-class tsd-is-private","parent":"State"},{"id":66,"kind":512,"name":"constructor","url":"classes/state.html#constructor","classes":"tsd-kind-constructor tsd-parent-kind-class","parent":"State"},{"id":67,"kind":2048,"name":"handle","url":"classes/state.html#handle","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":68,"kind":2048,"name":"addChildren","url":"classes/state.html#addchildren","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":69,"kind":2048,"name":"getChildren","url":"classes/state.html#getchildren","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":70,"kind":2048,"name":"addAncestors","url":"classes/state.html#addancestors","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":71,"kind":2048,"name":"getAncestors","url":"classes/state.html#getancestors","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":72,"kind":2048,"name":"addDescendants","url":"classes/state.html#adddescendants","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":73,"kind":2048,"name":"getDescendants","url":"classes/state.html#getdescendants","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":74,"kind":2048,"name":"addSiblings","url":"classes/state.html#addsiblings","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":75,"kind":2048,"name":"getSiblings","url":"classes/state.html#getsiblings","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":76,"kind":2048,"name":"equals","url":"classes/state.html#equals","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":77,"kind":2048,"name":"hasChildren","url":"classes/state.html#haschildren","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":78,"kind":2048,"name":"isParent","url":"classes/state.html#isparent","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":79,"kind":2048,"name":"isAncestor","url":"classes/state.html#isancestor","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":80,"kind":2048,"name":"isChild","url":"classes/state.html#ischild","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":81,"kind":2048,"name":"isSibling","url":"classes/state.html#issibling","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":82,"kind":2048,"name":"isDescendant","url":"classes/state.html#isdescendant","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":83,"kind":2048,"name":"setStateMachine","url":"classes/state.html#setstatemachine","classes":"tsd-kind-method tsd-parent-kind-class","parent":"State"},{"id":84,"kind":2048,"name":"emit","url":"classes/state.html#emit","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-protected","parent":"State"},{"id":85,"kind":2048,"name":"transition","url":"classes/state.html#transition","classes":"tsd-kind-method tsd-parent-kind-class tsd-is-protected","parent":"State"},{"id":86,"kind":256,"name":"ITransitionHandler","url":"interfaces/itransitionhandler.html","classes":"tsd-kind-interface"}]};