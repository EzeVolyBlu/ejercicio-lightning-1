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

    @AuraEnabled
    public static List<Case> closeCasesAndAddClosingReason(String[] jsonMessageById) {
        
        String caseId;
        String caseMessage;
        Map <Id, String> messageById = new Map<Id, String>();
        
        for(Integer i = 0; i < jsonMessageById.size(); i++){
            JSONParser parser = JSON.createParser(jsonMessageById[i]);
            while(parser.nextToken() != null){
                
                if(parser.getCurrentName() == 'id'){
                    caseId = parser.getText();
                }else if(parser.getCurrentName() == 'message'){
                    caseMessage = parser.getText();
                }
                if(caseId != null && caseMessage != null){
                    messageById.put(caseId, caseMessage);
                    caseId = null;
                    caseMessage = null;
                }
                parser.nextToken();
			}
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