#ifndef __C_ID_H__
#define __C_ID_H__

/*
*   ˵����
*   ���ļ�Ϊֻ��ģʽ�������޸Ĵ��ļ�
*   ���������޸�ֻ���� cfile.cpp �ļ�
*/

//�ӿں���������
typedef enum _enReturnCode_
{
	RT_NOT_IMPLEMENTED = 0,
	RT_SUCCESS = 1,
	RT_FAILED = 2,
};

/*
*   ˵����
*   ���ļ�Ϊֻ��ģʽ�������޸Ĵ��ļ�
*   ���������޸�ֻ���� cfile.cpp �ļ�
*/

/*��ʼ�������ӿ�*/
void ID_Init(void);

/*������ɺ����ӿ�*/
void ID_Uninit(void);

/*���һ����ϵ�˵Ľӿ�*/
int  ID_AddContact(char *pLastName, char *pFirstName, char *pPhoneNumber);

/*��ѯ��ϵ�˵Ľӿ�*/
int  ID_SearchContact(char *pInput, char *pLastName, char *pFirstName, char *pPhoneNumber);

/* ������ں���*/
void ID_TestCase();

/*
*   ˵����
*   ���ļ�Ϊֻ��ģʽ�������޸Ĵ��ļ�
*   ���������޸�ֻ���� cfile.cpp �ļ�
*/

#endif