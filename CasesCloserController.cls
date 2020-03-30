public class CasesCloserController {

    @AuraEnabled
    public static List <Account> fetchAllAccounts() {
        
        return [SELECT Id, Name 
                FROM Account ];
   }

   @AuraEnabled
    public static List<Case> getOpenCasesByAcc (String accId) {
        
        return  [SELECT Id, Subject, CreatedDate, AccountId, Status, Closing_reason__c 
                 FROM Case 
                 WHERE AccountId = :accId 
                 AND Status != 'Closed'];
    }

  
    public class MyWrapper {
        String id;
        String closingReason;
    }

    @AuraEnabled
    public static List<Case> updateCases(String[] jsonMessageById) {

        String caseId;
        String caseMessage;
        Map<Id, String> messageById = new Map<Id, String>();

        for(String element : jsonMessageById) {
            MyWrapper aWrapper = (MyWrapper) JSON.deserialize(element, MyWrapper.class);
            messageById.put(aWrapper.id, aWrapper.closingReason);
        }

        List <Case> casesToClose = new List<Case>();
        for(Case caseToClose : [SELECT Id, Subject, Status, AccountId, Closing_reason__c 
                                FROM Case 
                                WHERE Id IN :messageById.keySet()]){
            caseToClose.Closing_reason__c = messageById.get(caseToClose.Id);
            caseToClose.Status = 'Closed';
            casesToClose.add(caseToClose);
        }
        
        Database.update(casesToClose, false);
        
        return getOpenCasesByAcc(casesToClose[0].AccountId);
    }

}




