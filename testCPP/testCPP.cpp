//============================================================================
// Name        : testCPP.cpp
// Author      : 
// Version     :
// Copyright   : Your copyright notice
// Description : Hello World in C++, Ansi-style
//============================================================================

#include <iostream>
#include <fstream>
#include <string.h>
#include <vector>
#include <time.h>
using namespace std;
//#define DEBUG

//the leaf of a tree
struct leaves
{
    int nextleaves[10];
    int value[10];
};
#ifdef DEBUG
void printLeaves(leaves l)
{
	for(int i = 0 ; i <10; i++)
		cout << l.nextleaves[i] << ":" << l.value[i] << " ";
	cout<<endl;
}
#endif

int getTime()
{
	time_t rawtime;
	struct tm * timeinfo;

	time ( &rawtime );
	timeinfo = localtime ( &rawtime );
	printf ( "The current date/time is: %s", asctime (timeinfo) );

	return 0;
}

int init(vector<leaves> &h)
{
    //open file
	string line;
	ifstream myfile ("./prefixList.txt");

	leaves temp ;
	memset(&temp,0,sizeof(temp));

	h.push_back(temp);

	int curMax = 0;
	if (myfile.is_open())
	{
		int cur;
		int count = 1;
		while ( getline (myfile,line) )
		{
#ifdef DEBUG
			cout<<count<<":"<<line<<endl;
#endif
			cur = 0;
			string::iterator iter = line.begin();
			for (;iter != line.end(); iter++)
			{
				//this is not the end
				if(iter + 1 != line.end())
				{
					//next is not exist and
					if( h[cur].nextleaves[*iter - 48] == 0)
					{
						h[cur].nextleaves[*iter - 48] = ++curMax;
						h.push_back(temp);
					}

					cur = h[cur].nextleaves[*iter - 48];
				}
			}
			h[cur].value[*(iter-1) - 48] = count;
			count ++;
#ifdef DEBUG
			for (vector<leaves>::iterator iter = h.begin(); iter != h.end(); iter ++)
			{
			    cout << iter - h.begin() << ": ";
				printLeaves(*iter);
			}
			cout<<endl;
#endif
		}
		myfile.close();
	}
	cout<<"init successfully! node = "<<h.size()<<endl;
	return 0;


}

int checkNumber(const vector<leaves> h, string number, int& result)
{
	result = 0;
	int cur = 0;
#ifdef DEBUG
	cout << number <<endl;
#endif
	for (string::iterator iter = number.begin(); iter != number.end(); iter ++)
	{
#ifdef DEBUG
		cout<<cur<<"."<<*iter - 48<<"=" << h[cur].value[*iter - 48 ]<<endl;
#endif
		if(h[cur].value[*iter - 48 ] != 0)
		{
			result = h[cur].value[*iter - 48 ];
		}

#ifdef DEBUG
		cout<<cur<<"-"<<*iter - 48<<"=" << h[cur].nextleaves[*iter - 48 ]<<endl;
#endif
		if (h[cur].nextleaves[*iter - 48 ] != 0)
		{
			cur = h[cur].nextleaves[*iter - 48 ];
		}
		else
			break;
	}
	return 0;
}

int check(const vector<leaves> h)
{
	ifstream myfile ("./numbers.txt2");
	string number;
	int re[] = {1,1,3,3,4,4,0};
	int result = 0;


	if (myfile.is_open())
	{
		int count = 1;
		getTime();
		while ( getline (myfile,number) )
		{

			if(checkNumber(h,number,result) != 0 || result != count)
			{
				//cout<<count<<":"<<number<<" Current:"<<result<<"!= Expected:"<<re[count]<<endl;
				//return 1;
			}
#ifdef DEBUG
			else
			{
				cout<<count<<":"<<number<<" Current:"<<result<<"= Expected:"<<re[count]<<endl;
			}
#endif
			count ++;
			cout<<'\r'<<count;
			if(count % 8192 == 0)
			{
				cout<<endl;
				getTime();
			}

		}
		getTime();
		cout<<endl;
	}
	myfile.close();
	return 0;
}


int main()
{

    vector<leaves> h;

    if (init(h) != 0)
    {
    	cout<<"init failed!"<<endl;

    	return 1;
    }
    if(check(h) != 0)
    {
    	cout << "check failed!"<<endl;
    	return 1;
    }
    cout << "check Successfully!"<<endl;

    return 0;
}
