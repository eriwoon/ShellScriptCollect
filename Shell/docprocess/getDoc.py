import re
from docx import Document
from win32com import client as wc
import os
import json
import shutil
import time
import zipfile
import rarfile
import urllib.parse

homeDir = "C:\\Users\\x00194181\\Documents\\"
wxworkDir = homeDir + "WXWork\\1688852792010670\\Cache\\File\\2019-05\\"
workDir = homeDir + "docprocess\\"
curTime = time.strftime('%m%d_%H%M%S',time.localtime(time.time()))
tmpDir = workDir + curTime +"\\"

def Log(content):
	print(content)

def CreateDir(dir):
	if not os.path.exists(dir):
		os.makedirs(dir)
	if not os.path.exists(dir + "\\1.origin"):
		os.makedirs(dir + "\\1.origin")
	if not os.path.exists(dir + "\\2.docx"):
		os.makedirs(dir + "\\2.docx")

def MoveAndUnarchiveFile(file):
	'''
	将文件移动到临时目录
	解压缩
	'''
	#将文件移动到临时目录
	CreateDir(tmpDir)
	srcfile = wxworkDir + file
	dstfile = tmpDir + "1.origin\\" + file
	shutil.copyfile(srcfile,dstfile)
	Log("copy finished")
	#解压缩
	
	while True:
		allFiles = []
		for maindir, subdir, file_name_list in os.walk(tmpDir + "1.origin\\"):
			for file in file_name_list:
				allFiles.append(os.path.join(maindir, file))
		
		zipFiles = []
		rarFiles = []
		for file in allFiles:
			if file[-4:] == '.zip':
				Log("zip file append:"+ file)
				zipFiles.append(file)
			elif file[-4:] == ".rar":
				Log("rar file append:"+ file)
				rarFiles.append(file)
		if len(zipFiles) == 0 and len(rarFiles) == 0:
			break
		
		if(len(zipFiles) != 0): #解压缩zip文件
			for zipFile in zipFiles:
				Log("unzip file:" + zipFile)
				file_zip = zipfile.ZipFile(zipFile, 'r')
				for f in file_zip.namelist():
					file_zip.extract(f, tmpDir + "1.origin\\")
				file_zip.close()
				os.remove(zipFile)

		if(len(rarFiles) != 0): #解压缩rar文件
			for rarFile in rarFiles:
				Log("unrar file:" + rarFile)
				rf = rarfile.RarFile(rarFile)
				rf.extractall(tmpDir + "1.origin\\") 
				os.remove(rarFile)

def TansDoc2Docx(dir):
	#找到所有的doc文件
	'''转换成docx
	提取url
	保存到文件'''
	allFiles = []
	for maindir, subdir, file_name_list in os.walk(tmpDir + "1.origin\\"):
		for file in file_name_list:
			allFiles.append(os.path.join(maindir, file))
	
	docFiles = []
	for file in allFiles:
		if file[-4:] == '.doc' or file[-4:] == '.rtf':
			docFiles.append(file)
	
	Log("Found " + str(len(docFiles)) + " doc file[s]")
	retFileList = []

	if len(docFiles) != 0:
		Log("Initing word application")
		word = wc.Dispatch('Word.Application')
		for file in docFiles:			
			(filepath, filename) = os.path.split(file)
			Log("Processing file:" + filename)
			doc = word.Documents.Open(file)  # 目标路径下的文件
			doc.SaveAs(tmpDir + "2.docx\\" + filename, 12, False, "", True, "", False, False, False, False)  # 转化后路径下的文件
			retFileList.append(tmpDir + "2.docx\\" + filename)
			doc.Close()
		word.Quit()
	
	return retFileList

def RetrieveURL(docFileList):
	urlList = []
	r = re.compile(u'(http[s]?://.*)')
	for file in docFileList:
		docFile = Document(file)
		for para in docFile.paragraphs:
			url = re.findall(r, para.text)
			if len(url) != 0:
				url = urllib.parse.quote(url[0], safe='~@#$&()*!+=:;,.?/\'')
				(filepath, filename) = os.path.split(file)
				urlList.append([filename,url])
				break
	return urlList

def WriteToFile(urlList):
	for line in urlList:
		with open(tmpDir + "\\url_" + curTime + ".csv", "a+", encoding="ansi") as f:
			f.write(line[0] + "," + line[1] + "\n")

def main():
	fileList = os.listdir(wxworkDir)

	with open(workDir + "record.json","r") as f:
		previousFileList = json.load(f)
	
	with open(workDir + "record.json","w") as f:
		json.dump(fileList,f)	

	for file in fileList:
		if(file not in previousFileList):
			Log("New archive file found:" + file)
			MoveAndUnarchiveFile(file)



	if os.path.exists(tmpDir):
		docFileList = TansDoc2Docx(tmpDir)#rtf转换成doc
		#提取url
		urlList = RetrieveURL(docFileList)
		Log(urlList)
		WriteToFile(urlList)

main()