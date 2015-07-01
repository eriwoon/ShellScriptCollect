#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cfile.h"

template<class T> class XZList
{
public:
    T *p;
    int len;    //当前有意义的数值的长度
    int maxlen; //最大的长度
    bool complex;//标志是否需要调用对象的析构函数
    
    //Type define
public:
    typedef XZList<T> XZT; //用来分片的时候使用
    typedef int(*pf)(T);  //用来实现foreach的时候的工作.
    
    //构造和析构函数
public:
    XZList(bool c = 0,  int n = 100)
    {
        this->complex = c;
        this->maxlen = n;
        this->len = 0;
        this->p = new T[n + 1];
    }
    //拷贝构造函数
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
    
    //list 相关操作
public:
    /* 返回当前List的长度*/
    int count(){ return len; }
    
    /* 排序算法,需要要求对象实现 ">" 操作符*/
    void sort(bool reverse = false);//默认从小到大排序,例如12345; true表示从大到小
    
    /* 插入一个元素到当前的List中去*/
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
    
    /* 清除当前内容*/
    void clear(){ len = 0; }
    
    /* 返回最后一个值,并且将这个值从数组中去掉
     * 需要在调用前确保当前len不是最小
     * 退出的时候需要判断当前的值是否需要析构*/
    T pop()
    {
        this->len -= 1;
        T ret = this->p[this->len];
        if(this->complex == true)this->p[this->len].~T();
        return ret;
    }
    
    /* 返回最后一个值*/
    T tail(){ return this->p[this->len - 1]; }
    
    /* 实现根据sp将字段进行分片的能力
     * 输入参数是分隔符, 输入参数是一个包含各个分片的数组*/
    XZList<XZT> split(T sp);
    
    /* 实现一个对于当前列表中的每一个值进行一次操作,参数是一个int p(T)的函数*/
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
    
    
    //赋值以及运算符重载
public:
    /*实现一个赋值操作,拷贝到遇到结束标志
     * 例如 char end = '\0'; string.set(charsting, &end)*/
    void set(T* nodes,                   //输入的对象的数组,例如一个char*的数组
             T* endFlag,                //结束的标志位,例如 '\0', 为了和int做区分,这里要输入一个指针
             int maxNodeLen = -1)       //最大长度,-1时候使用this->maxlen
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
    
    /*实现一个赋值操作
     * 例如 string.set(charsting, 10)*/
    void set(T* list,                   //输入的对象的数组,例如一个char*的数组
             int Tlenth);               //字符串的长度,例如10
    
    /*实现一个赋值操作
     * 例如 str = str1 + str2*/
    XZT operator+(XZT right);   //右值
    
};

//lambda函数们
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

/*初始化函数接口*/
void ID_Init()
{
    return;
}


/*添加一个联系人的接口*/
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


/*查询联系人的接口*/
int ID_SearchContact(char *pInput, char *pLastName, char *pFirstName, char *pPhoneNumber)
{
    return RT_NOT_IMPLEMENTED;
}


/*工作完成函数接口*/
void ID_Uninit(void)
{
    return;
}