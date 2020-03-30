({
    init: function (cmp, event, helper) {
        cmp.set('v.columns', [
            {label: 'Subject', fieldName: 'Subject', type: 'text', editable: 'true'},
            {label: 'Created date', fieldName: 'CreatedDate', type: 'date', typeAttributes:{
                                                                                year: "numeric",
                                                                                month: "2-digit",
                                                                                day: "2-digit",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit"}
            },
            {label: 'Closing reason', fieldName: 'Closing_reason__c', type: 'text', editable: 'true'},
        ]);
    },
    handleSelected: function (cmp, event, helper) {
        helper.disableButton(cmp, true)
        var selectedRows = event.getParam('selectedRows');
        let idCasesSelected = [] ;
        for(let index in selectedRows) { 
            idCasesSelected.push(selectedRows[index].Id);
        }
        cmp.set('v.idCasesSelected', idCasesSelected);

    },
    handleSave: function (cmp, event, helper) {
        
        let draftValues = event.getParam('draftValues');
        let idCasesSelected = cmp.get('v.idCasesSelected');
        const idCasesEdited = [];
        let errors = {
            rows: {}
        };
        const idMapClosingReason = [];
        cmp.set("v.errors", errors)

        try {

            //1er check: reviso los campos editados que esten seleccionados y con mensaje 
            for(let index in draftValues){

                //guardo la id de cada fila editada. sirve para 2do check
                idCasesEdited.push(draftValues[index].Id)
                //check si la fila esta selected
                if(idCasesSelected.includes(draftValues[index].Id)){
                    //check que el mensaje no este vacio
                    if(!(draftValues[index].Closing_reason__c)) {
                        //error mensaje vacio
                        let idEdited = draftValues[index].Id;
                        errors.rows[idEdited] = { title: 'Error saving info', 
                        messages: 'Closing reason missing',
                        fieldNames: ['Closing_reason__c']};
                    } else {
                        //la fila esta seleccionada y con mensaje
                        idMapClosingReason.push({
                            id: draftValues[index].Id,
                            closingReason: draftValues[index].Closing_reason__c
                        })
                    }
                } else {
                    //error fila no selected
                    let idEdited = draftValues[index].Id;
                    errors.rows[idEdited] = { title: 'Error saving info', 
                    messages: 'The edited row is not checked',
                    fieldNames: []};
                }
            }

            //2do check: reviso que no hayan casos sin mensaje
            for(let index in idCasesSelected){
                
                if(!(idCasesEdited.includes(idCasesSelected[index]))){
                    let idSelected = idCasesSelected[index];
                    errors.rows[idSelected] = { title: 'Error saving info', 
                    messages: 'Closing reason missing',
                    fieldNames: ['Closing_reason__c']};

                }
            }

            if(Object.keys(errors.rows).length){
                throw new Error
            } else {
                helper.handleSave(cmp, event, helper, idMapClosingReason);
            }

        } catch(e){
            cmp.set("v.errors", errors)
            cmp.set("v.errorButtonVisible", true)
            helper.disableButton(cmp, true);
        }
        
    },
    removeError: function (cmp) {
        const errors = {
            rows: {}
        }
     
        cmp.set("v.errors", errors);
        cmp.set("v.errorButtonVisible", false)

    },
    tablechanged: function (cmp, event, helper) {
        helper.disableButton(cmp, true)
    }
    
})
