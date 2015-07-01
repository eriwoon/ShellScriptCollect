// ConsoleApplication1.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "cfile.h"
#include <string>

void Assert(int result)
{
	if (result != 0)
	{
		printf("Failed!\n");
	}
}

void ID_TestCase()
{
	ID_Init();

	//1. �ɹ����һ����ϵ�˺���
	char* pLastName = "Zhang";
	char* pFirstName = "san";
	char* pPhoneNumber = "13712345678";
	if (ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_SUCCESS)
	{
		printf("Failed 1\n");
		return ;
	}

	//2. �����ϵ��ʧ��
	pLastName = "";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	//3. �����а���26����ĸ������ַ�
	pLastName = "Zhan2g";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	//4. �����а���26����ĸ������ַ�
	pLastName = "Zhang";
	pFirstName = "san2";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	pLastName = "Zhang";
	pFirstName = "san";
	pPhoneNumber = "13712345678";

	//5. �ճ����쳣
	pLastName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	//6. �������쳣
	pFirstName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
	pLastName = "Zhang";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	//7. �绰���볤���쳣
	pFirstName = "san";
	pPhoneNumber = "012345678901234567890123456789012";
	Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);

	//8. ��ѯʱ,�����������32
	char* pInput = "012345678901234567890123456789012";
	char szLastName[64] = { 0 };
	char szFirstName[64] = { 0 };
	char szPhoneNumber[64] = { 0 };
	Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_FAILED);

	//9.������ϵ�˳ɹ�, ƥ�����
	pLastName = "Zhang";
	pFirstName = "san";
	pPhoneNumber = "13712345678";
	pInput = "137";
	Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
	Assert(strcmp(szLastName, pLastName) == 0);
	Assert(strcmp(szFirstName, pFirstName) == 0);
	Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);

	//10. ͨ�������� sa
	pInput = "72";
	Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
	Assert(strcmp(szLastName, pLastName) == 0);
	Assert(strcmp(szFirstName, pFirstName) == 0);
	Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);

	//12. ͨ���ղ��� zh
	pInput = "94";
	Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
	Assert(strcmp(szLastName, pLastName) == 0);
	Assert(strcmp(szFirstName, pFirstName) == 0);
	Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);

	//13. ͨ��������д���� zs
	pInput = "97";
	Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
	Assert(strcmp(szLastName, pLastName) == 0);
	Assert(strcmp(szFirstName, pFirstName) == 0);
	Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);

	ID_Uninit();
}


int _tmain(int argc, _TCHAR* argv[])
{
	int a;
	a = 100;
	printf("Hello world!\n");
	ID_TestCase();
	printf("Test finished!\n");
	return 0;
}


