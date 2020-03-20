@isTest
public class CasesCloserControllerTest {
    static Integer numberOfAccounts;
    static Integer numberOfCases;
	
	static {
		numberOfAccounts = 20;
		numberOfCases = 10;
    }
    
    public class IdMessageJSON {
        public String id;
        public String message;
	}
    
    @testSetup
    private static void setupAccountsAndCases() {

        //inserting accounts
        List<Account> accountList = new List<Account>();
        for(Integer i = 0; i < numberOfAccounts; i++){
            Account testAccount = new Account(Name = 'test acc ' + i);
            accountList.add(testAccount); 
        }
        Database.SaveResult[] accountResults = Database.insert(accountList, false) ;

        //inserting cases for each account
        List<Case> casesList = new List<Case>();
        for(Database.SaveResult accResult : accountResults){
            
            for(Integer i = 0; i < numberOfCases; i++){
                Case newCase = New Case(AccountId = accResult.getId(), 
                                        Status = 'New');
                casesList.add(newCase);
                Case workingCase = New Case(AccountId = accResult.getId(), 
                                        Status = 'Working');
                casesList.add(workingCase);            
                Case escalatedCase = New Case(AccountId = accResult.getId(), 
                                        Status = 'Escalated');
                casesList.add(escalatedCase);
                Case closedCase = New Case(AccountId = accResult.getId(), 
                                        	Status = 'Closed', 
                                           Closing_reason__c = 'Closed for testing');
                casesList.add(closedCase);
            }
        }
        insert casesList;
    }

    static List<Id> returnAllTheAccountsIds(){
        List<Id> accIds = New List<Id>();
        for(Account acc : [SELECT Id, Name FROM Account]){
            accIds.add(acc.Id);
        }
        return accIds;
    }

    static List<Case> returnAllTheOpenCases(){
        List<Id> accIds = returnAllTheAccountsIds();
        List<Case> openCases = New List<Case>();
        for(Case openCaseRelated : [SELECT Id, Subject, CreatedDate, AccountId, Status, Closing_reason__c 
                 FROM Case 
                 WHERE AccountId IN :accIds 
                 AND Status != 'Closed']){
            openCases.add(openCaseRelated);
        }
        return openCases;
    }
    
    @isTest static void testFetchAllTheAccounts(){

        List<Account> testingAccounts = [SELECT Id, Name 
                                        	FROM Account];
        
        Test.startTest();
        List<Account> allAccounts = CasesCloserController.fetchAllAccounts();
        Test.stopTest();

        System.assertEquals(testingAccounts, allAccounts, 'Error fetching accounts');
    }

    @isTest static void testFetchOpenCasesFromAccount(){

        List<Id> allTheAccountsIds = returnAllTheAccountsIds();
        List<Case> allTheOpenCases = returnAllTheOpenCases();
        List<Case> openCases = New List<Case>();
        
        Test.startTest();
        for(Id accId : allTheAccountsIds){
            openCases.addAll(CasesCloserController.getOpenCasesByAcc(accId));
        }
        Test.stopTest();

        System.assertEquals(allTheOpenCases, openCases, 'Error fetching cases related');
    }

    @isTest static void testClosingCasesAndChangingMessagesFromAccount(){

        List<Id> allTheAccountsIds = returnAllTheAccountsIds();
        List<List<Case>> listOfListOfOpenCasesById = New List<List<Case>>();
		List<Case> updatedOpenCases;
        String[] messageByIdJSONList = new List<String>();
        IdMessageJSON newIdMessageJSONObj = new IdMessageJSON();
        for(Id accId : allTheAccountsIds){
            listOfListOfOpenCasesById.add(CasesCloserController.getOpenCasesByAcc(accId)); 
         }
     
        Test.startTest();
        for(List<Case> listOfOpenCasesById :  listOfListOfOpenCasesById){
            for(Case openCaseById : listOfOpenCasesById){
                newIdMessageJSONObj.message = 'Closed for testing';
				newIdMessageJSONObj.id = openCaseById.Id;
                messageByIdJSONList.add(JSON.serialize(newIdMessageJSONObj));
            }
            updatedOpenCases = CasesCloserController.closeCasesAndAddClosingReason(messageByIdJSONList);
            messageByIdJSONList.clear();
        }
        Test.stopTest();

        System.assertEquals(updatedOpenCases, [SELECT Id, Subject, Status, AccountId, Closing_reason__c, CreatedDate 
                                                FROM Case 
                                                WHERE Status != 'Closed'], 
                            'Error closing cases');
        
        System.assertEquals(updatedOpenCases, [SELECT Id, Subject, Status, AccountId, Closing_reason__c, CreatedDate 
                                                FROM Case 
                                                WHERE Closing_reason__c != 'Closed for testing'], 
                            'Error adding closing reason');
    }
}