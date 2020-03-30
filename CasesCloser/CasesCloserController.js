({
    //load account select in the dropdown
    init: function (component, event, helper) {
        component.set("v.spinner", true); 
        helper.fetchAccounts(component, event, helper);
    },
    handleAccountSelected: function (component, event, helper) {
        component.set("v.spinner", true); 
		helper.handleAccountSelected(component, event, helper);
    },
    handleClosedCases: function (component, event, helper) {
        component.set('v.closedCasesList', event.getParam("closedCases"));
    },
    manageSubmitButton: function (component, event) {
        component.set('v.submitButtonDisabled', event.getParam("disableButton"));
    },
    submitCases: function(cmp, event, helper){
        try {
            const jsonMessageById = [];        
            let errors = {
                rows: {},
                table: {}
            }
            const closedCasesList = cmp.get('v.closedCasesList');
            for(let index in closedCasesList) {
                
                if(!closedCasesList[index].id || !closedCasesList[index].closingReason){
                    throw new Error;
                } else {
                    jsonMessageById.push(JSON.stringify(closedCasesList[index]));
                }
            }

            if(!(Object.keys(errors.table).length)){
                cmp.set("v.spinner", true); 
                helper.submitCases(cmp, event, helper, jsonMessageById)
            }

        } catch (e){
            console.log(e);
            let errors = {
                rows: {},
                table: {
                    title: 'Your entry cannot be saved. Fix the errors and try again.',
                    messages: [
                        e.message
                    ]
                }
            };
           cmp.set('v.errors', errors)
           cmp.set('v.errorButtonVisible', true)
        }
    },
    closemessage: function(cmp){

        var div1 = cmp.find("div1");
        div1.set("v.body", "");        
    },
    handleSpinnerEvent: function(cmp, event, helper){
        component.set('v.spinner', event.getParam("spinnerVisible"));
    }
})