({
    //load account select in the dropdwon
    doInit: function (component, event, helper) {
        
        component.set("v.spinner", true); 
        helper.fetchAllAccountsHelper(component, event, helper);
    },
    
    //Load cases in the table of the selected account 
    handleOptionDropdownSelected: function (component, event, helper) {
        component.set("v.spinner", true); 
		helper.handleOptionDropdownSelected(component, event, helper);
    },
        
    //select all checkbox
    handleSelectAllCheckbox: function(component, event, helper) {
        helper.handleSelectAllCheckbox(component, event, helper);
    },
    
    //Submit the selected contacts
    submitSelected: function(component, event, helper) {
        
        try {
            helper.submitSelected(component, event, helper);
        } catch (e) {

            $A.createComponents([
                ["ui:message",
                 {
                    "title" : "Submit error",
                    "severity" : "error",
                     "closable" : "true"
               	 }],
                ["ui:outputText",
                 {
               	 "value" : e.message
              	  }]
                ],
                function(components, status, errorMessage){
                    if (status === "SUCCESS") {
                        var message = components[0];
                        var outputText = components[1];
                        
                        // set the body of the ui:message to be the ui:outputText
                        message.set("v.body", outputText);
                        var div1 = component.find("div1");
                    	div1.set("v.body", message);
                    }else if (status === "INCOMPLETE" || status === "ERROR") {
                    	console.log("Error from controller: " + errorMessage);
                    }
                }
			);
        }
    },
    
    closemessage: function(component, event, helper){

        var div1 = component.find("div1");
        div1.set("v.body", "");        
    },
    
    
})