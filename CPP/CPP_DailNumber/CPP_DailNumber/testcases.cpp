//
//  testcases.cpp
//  CPP_DailNumber
//
//  Created by eric on 7/2/15.
//  Copyright (c) 2015 eric. All rights reserved.
//

#include <stdio.h>
// ConsoleApplication1.cpp : Defines the entry point for the console application.
//
#ifdef _WIN32
#include "stdafx.h"
#endif
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
    
    //1. 成功添加一个联系人号码
    char* pLastName = "Zhang";
    char* pFirstName = "san";
    char* pPhoneNumber = "13712345678";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) != RT_SUCCESS);
    
    //2. 添加联系人失败
    pLastName = "";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    //3. 姓名中包含26个字母以外的字符
    pLastName = "Zhan2g";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    //4. 姓名中包含26个字母以外的字符
    pLastName = "Zhang";
    pFirstName = "san2";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    pLastName = "Zhang";
    pFirstName = "san";
    pPhoneNumber = "13712345678";
    
    //5. 姓长度异常
    pLastName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    //6. 名长度异常
    pFirstName = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    pLastName = "Zhang";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    //7. 电话号码长度异常
    pFirstName = "san";
    pPhoneNumber = "012345678901234567890123456789012";
    Assert(ID_AddContact(pLastName, pFirstName, pPhoneNumber) == RT_FAILED);
    
    //8. 查询时,输入参数超过32
    char* pInput = "012345678901234567890123456789012";
    char szLastName[64] = { 0 };
    char szFirstName[64] = { 0 };
    char szPhoneNumber[64] = { 0 };
    Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_FAILED);
    
    //9.查找联系人成功, 匹配号码
    pLastName = "Zhang";
    pFirstName = "san";
    pPhoneNumber = "13712345678";
    pInput = "137";
    Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
    Assert(strcmp(szLastName, pLastName) == 0);
    Assert(strcmp(szFirstName, pFirstName) == 0);
    Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);
    
    //10. 通过名查找 sa
    pInput = "72";
    Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
    Assert(strcmp(szLastName, pLastName) == 0);
    Assert(strcmp(szFirstName, pFirstName) == 0);
    Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);
    
    //12. 通过姓查找 zh
    pInput = "94";
    Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
    Assert(strcmp(szLastName, pLastName) == 0);
    Assert(strcmp(szFirstName, pFirstName) == 0);
    Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);
    
    //13. 通过姓名缩写查找 zs
    pInput = "97";
    Assert(ID_SearchContact(pInput, szLastName, szFirstName, szPhoneNumber) == RT_SUCCESS);
    Assert(strcmp(szLastName, pLastName) == 0);
    Assert(strcmp(szFirstName, pFirstName) == 0);
    Assert(strcmp(szPhoneNumber, pPhoneNumber) == 0);
    
    ID_Uninit();
}

