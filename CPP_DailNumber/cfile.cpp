#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cfile.h"

template<class T> class XZList
{
public:
	T *p;
	int len;    //��ǰ���������ֵ�ĳ���
	int maxlen; //���ĳ���
	bool complex;//��־�Ƿ���Ҫ���ö������������

	//Type define
public:
	typedef XZList<T> XZT; //������Ƭ��ʱ��ʹ��
	typedef int(*pf)(T);  //����ʵ��foreach��ʱ��Ĺ���.

	//�������������
public:
	XZList(bool c = 0,  int n = 100)
	{
		this->complex = c;
		this->maxlen = n;
		this->len = 0;
		this->p = new T[n + 1];
	}
	//�������캯��
	XZList(const XZT& node)
	{
		this->maxlen = node.maxlen;
		this->p = new T[node.maxlen + 1];
		this->len = node.len;
		this->complex = node.complex;
		for (int i = 0; i < this->len; i++)
			this->p[i] = node.p[i];
	}


	~XZList(){ 
		if (this->complex == true)
		{
			for (int i = 0; i < this->len; i++)
				this->p[i].~T();
		}
		delete [] p; 
	}

	//list ��ز���
public:
	/* ���ص�ǰList�ĳ���*/
	int count(){ return len; }

	/* �����㷨,��ҪҪ�����ʵ�� ">" ������*/
	void sort(bool reverse = false);//Ĭ�ϴ�С��������,����12345; true��ʾ�Ӵ�С

	/* ����һ��Ԫ�ص���ǰ��List��ȥ*/
	int append(T node){
		if (this->len >= this->maxlen)
			return 1;
		else
		{
			this->p[this->len] = node;
			this->len += 1;
			return 0;
		}
	}

	/* �����ǰ����*/
	void clear(){ len = 0; }

	/* �������һ��ֵ,���ҽ����ֵ��������ȥ��
	* ��Ҫ�ڵ���ǰȷ����ǰlen������С
	* �˳���ʱ����Ҫ�жϵ�ǰ��ֵ�Ƿ���Ҫ����*/
	T pop()
	{ 
		this->len -= 1; 
		T ret = this->p[this->len];
		if(this->complex == true)this->p[this->len].~T();
		return ret;
	}

	/* �������һ��ֵ*/
	T tail(){ return this->p[this->len - 1]; }

	/* ʵ�ָ���sp���ֶν��з�Ƭ������
	* ��������Ƿָ���, ���������һ������������Ƭ������*/
	XZList<XZT> split(T sp);

	/* ʵ��һ�����ڵ�ǰ�б��е�ÿһ��ֵ����һ�β���,������һ��int p(T)�ĺ���*/
	int foreach(pf function)
	{
		int re = 0;

		for (int i = 0; i < this->len; i++)
		{
			re = function(this->p[i]);
			if (re != 0)
				return re;
		}
		return 0;
	}


	//��ֵ�Լ����������
public:
	/*ʵ��һ����ֵ����,����������������־
	* ���� char end = '\0'; string.set(charsting, &end)*/
	void set(T* nodes,                   //����Ķ��������,����һ��char*������
		T* endFlag,                //�����ı�־λ,���� '\0', Ϊ�˺�int������,����Ҫ����һ��ָ��
		int maxNodeLen = -1)       //��󳤶�,-1ʱ��ʹ��this->maxlen
	{
		if (maxNodeLen < 0)
		{
			maxNodeLen = this->maxlen;
		}

		for (this->len = 0; this->len < this->maxlen; this->len++)
		{
			if (this->len >= maxNodeLen || nodes[this->len] == *endFlag)
				break;
			else
			{
				this->p[this->len] = nodes[this->len];
			}
		}

	}

	/*ʵ��һ����ֵ����
	* ���� string.set(charsting, 10)*/
	void set(T* list,                   //����Ķ��������,����һ��char*������
		int Tlenth);               //�ַ����ĳ���,����10

	/*ʵ��һ����ֵ����
	* ���� str = str1 + str2*/
	XZT operator+(XZT right);   //��ֵ

};

//lambda������
int print_char(char c)
{
	printf("%c", c);
	return 0;
}



typedef XZList<char> XZList_c;

struct Contact{
	XZList_c sLastName;
	XZList_c sFristName;
	XZList_c sPhoneNumber;
};
XZList<Contact> contacts(true);

/*��ʼ�������ӿ�*/
void ID_Init()
{
	return;
}


/*���һ����ϵ�˵Ľӿ�*/
int ID_AddContact(char *pLastName, char *pFirstName, char *pPhoneNumber)
{
	Contact c;
	char end = '\0';
	c.sFristName.set(pFirstName, &end);
	c.sLastName.set(pLastName, &end);
	c.sPhoneNumber.set(pPhoneNumber, &end);

	contacts.append(c);

	contacts.tail().sFristName.foreach(print_char);

	return RT_NOT_IMPLEMENTED;
}


/*��ѯ��ϵ�˵Ľӿ�*/
int ID_SearchContact(char *pInput, char *pLastName, char *pFirstName, char *pPhoneNumber)
{
	return RT_NOT_IMPLEMENTED;
}


/*������ɺ����ӿ�*/
void ID_Uninit(void)
{
	return;
}
