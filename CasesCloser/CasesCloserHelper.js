({
    getOpenCasesByAccId: function (component, event, helper) {

        var action = component.get("c.getOpenCasesByAcc");
        action.setParams({
            accId: component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                component.set("v.spinner", false); 
                const values = response.getReturnValue(); 
                component.set("v.openCasesList" ,  values ) ; 
                console.log(values);
            }
        });
        $A.enqueueAction(action); 
    },

    submitCases: function (cmp, event, helper, jsonMessageById) {

        var action = cmp.get("c.updateCases");
                
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
                            var div1 = cmp.find("div1");
                            
                            // Replace div body with the dynamic component
                            div1.set("v.body", message);
                        }else if (status === "INCOMPLETE" || status === "ERROR") {
                            console.log("Error from helper: " + errorMessage);
                        }
                    }
                );

                const values = response.getReturnValue(); 
                cmp.set("v.openCasesList" ,  values ) ;

                //success message
               console.log('success')
                    
            }
            cmp.set("v.spinner", false);
                
        });
        
        $A.enqueueAction(action);



    }
    
                
    
                    
                    
                    
                    
                    
    
})