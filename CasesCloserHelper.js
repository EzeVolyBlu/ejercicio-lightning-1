({
    fetchAllAccountsHelper : function(component, event, helper) {
        
        var action = component.get("c.fetchAllAccounts");
        var options = [];
        
        action.setParams({
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                response.getReturnValue().map((value) => {
                    options.push({
                    value:value.Id, 
                    label:value.Name})
            })
            component.set("v.spinner", false); 

            component.set("v.statusOptions", options);
        	}
		});
        $A.enqueueAction(action);
    },
    
    handleOptionDropdownSelected: function (component, event, helper) {
		
        var action = component.get("c.getOpenCasesByAcc");
        action.setParams({accId:event.getParam("value")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                component.set("v.spinner", false); 
                const values = response.getReturnValue(); 
                component.set("v.cases" ,  values ) ; 
                
                if(values.length > 0){
                    component.set("v.disableCheckBox" ,  false ) ; 
                }else{
                    component.set("v.disableCheckBox" ,  true ) ;
                }
                
            }
        });
        $A.enqueueAction(action); 
    },
    
    handleSelectAllCheckbox: function(component, event, helper) {
        var checkvalue = component.find("selectAll").get("v.value");        
        var checkContact = component.find("checkContact"); 
        if(checkvalue == true){
            for(var i=0; i<checkContact.length; i++){
                checkContact[i].set("v.value",true);
            }
        }
        else{ 
            for(var i=0; i<checkContact.length; i++){
                checkContact[i].set("v.value",false);
            }
        }
    },

    submitSelected : function (component, event, helper) {
        
        const checkvalue = component.find("checkContact");
        const inputvalue = component.find("inputcontact");
        const jsonMessageById = [];
        
        if(!Array.isArray(checkvalue)){
            if (checkvalue.get("v.value") == true) {
                
                let id = checkvalue.get("v.text");
                let message = inputvalue.get("v.value");
                if(!message){
                    throw new Error('Error message goes here');
                }else{
                	jsonMessageById.push(JSON.stringify({
                        id,
                        message
                	}));    
                }
            }

    	}else{
			for (var i = 0; i < checkvalue.length; i++) {
                    
				if (checkvalue[i].get("v.value") == true) {
                    let id = checkvalue[i].get("v.text");
                    let message = inputvalue[i].get("v.value");
                    
                    if(!message){
                    	const subj = component.find("subject");
						const errorMessage = subj[i].get("v.value");
                    	let error = 'Closing reason missing for ';
                    
                    	throw new Error(error.concat(errorMessage));
                	}else{
                    	jsonMessageById.push(JSON.stringify({
                            id,
                            message
                        }));
                	}
                }
			}
                    
			var action = component.get("c.closeCasesAndAddClosingReason");
			component.set("v.spinner", true); 
                    
			action.setParams({
				jsonMessageById
			});
			
			action.setCallback(this, function(response){
				var state = response.getState();
				if (state === "SUCCESS") {
                    
                    //success message
                    $A.createComponents([
                        ["ui:message",
                         {
                            "title" : "Done",
                            "severity" : "confirm",
                             "closable" : "true"
                         }],
                        ["ui:outputText",
                         {
                         "value" : "the cases were succesfuly closed"
                          }]
                        ],
                        function(components, status, errorMessage){
                            if (status === "SUCCESS") {
                                var message = components[0];
                                var outputText = components[1];
                                
                                // set the body of the ui:message to be the ui:outputText
                                message.set("v.body", outputText);
                                var div1 = component.find("div1");
                                
                                // Replace div body with the dynamic component
                                div1.set("v.body", message);
                            }else if (status === "INCOMPLETE" || status === "ERROR") {
                                console.log("Error from helper: " + errorMessage);
                            }
                        }
                    );
                    
                    const values = response.getReturnValue(); 
                    component.set("v.cases" ,  values ) ;
                        
                }
				component.set("v.spinner", false);
                    
			});
			$A.enqueueAction(action);
       }            
    },
    
                    
    
                    
                    
                    
                    
                    
    
})