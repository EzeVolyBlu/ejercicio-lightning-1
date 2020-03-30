({
    handleSave: function (cmp, event, helper, idMapClosingReason){
        var createEvent = cmp.getEvent("closedCases");
        createEvent.setParams({ 
            "closedCases": idMapClosingReason 
        });
        createEvent.fire();

        this.disableButton(cmp, false);
    },
    disableButton: function (cmp, disabled){
        var createEvent = cmp.getEvent("disableButton");
        createEvent.setParams({ 
            "disableButton": disabled 
        });
        createEvent.fire();
    }
})
