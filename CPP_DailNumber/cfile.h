#ifndef __C_ID_H__
#define __C_ID_H__

/*
*   说明：
*   本文件为只读模式，请勿修改此文件
*   考生所有修改只限于 cfile.cpp 文件
*/

//接口函数返回码
typedef enum _enReturnCode_
{
	RT_NOT_IMPLEMENTED = 0,
	RT_SUCCESS = 1,
	RT_FAILED = 2,
};

/*
*   说明：
*   本文件为只读模式，请勿修改此文件
*   考生所有修改只限于 cfile.cpp 文件
*/

/*初始化函数接口*/
void ID_Init(void);

/*工作完成函数接口*/
void ID_Uninit(void);

/*添加一个联系人的接口*/
int  ID_AddContact(char *pLastName, char *pFirstName, char *pPhoneNumber);

/*查询联系人的接口*/
int  ID_SearchContact(char *pInput, char *pLastName, char *pFirstName, char *pPhoneNumber);

/* 测试入口函数*/
void ID_TestCase();

/*
*   说明：
*   本文件为只读模式，请勿修改此文件
*   考生所有修改只限于 cfile.cpp 文件
*/

#endif