#! /usr/bin/python
#coding: utf-8
import sys
import os
import re

def findAllFile(dir):
	folder = [dir]
	file = []
	
	while len(folder) > 0:
		curDir = folder[0]
		folder.pop(0)
		
		lst = os.listdir(curDir)
		
		for i in lst:
			name = curDir + '\\' + i
			if os.path.isfile(name) == True:
				file.append(name)
			else:
				folder.append(name)
	
	return file

def filterExtension(files, extension):
	outputFiles = []
	for file in files:
		if os.path.splitext(file)[1] == extension:
			outputFiles.append(file)
	
	return outputFiles

def avpReplaceDefination():
	return {
		re.compile('^\s*avp\s+264\s*$') : '''ASSIGN_RULE = crl_begin
shadow0;
} crl_end;
''',
		re.compile('^\s*avp\s+296\s*$') : '''ASSIGN_RULE = crl_begin
shadow1;
} crl_end;
'''
	}

def replaceFilesWithAvp(files, avpReplace):
	log = open("replaceAVP.py.log", "a+")
	for file in files:
		log.write("open file:" + file + "\n")
		f = open(file, 'r')
		new_content = ""
		
		reAssignmentModeA = re.compile("^\s*ASSIGNMENT_MODE\s*=\s*A\s*;.*")
		reAssignmentModeR = re.compile("^\s*ASSIGNMENT_MODE\s*=\s*R\s*;.*")
		reEvtAttrId = re.compile("^\s*EVT_ATTR_ID\s*=.*;.*")
		reLiftBrace = re.compile("^\s*{.*")
		reRightBrace = re.compile("^\s*}.*")
		
		lineNo = 1
		line = f.readline()
		while line != "":
			patternMatched = False
			for pattern in avpReplace:
				if pattern.match(line) :
					#print("line matched pattern : " + line)
					log.write(str(lineNo) + ":line matched pattern : " + line)
					patternMatched = True
					new_content += line
					
					lineNo += 1
					line = f.readline()
					while line != "":
					#This is the place to find all content enclosed by { }
						if reRightBrace.match(line):
							#print("reRightBrace.matched" + line)
							log.write(str(lineNo) + ":reRightBrace.matched : " + line + '\n')
							new_content += line
							break
						elif reAssignmentModeA.match(line):
							#print("reAssignmentModeA.matched" + line)
							log.write(str(lineNo) + ":reAssignmentModeA.matched : " + line)
							split = line.split("=")
							newline = split[0] + "=" + split[1].replace("A","R")
							new_content += newline
						elif reAssignmentModeR.match(line):
							#print("reAssignmentModeR.matched" + line)
							log.write(str(lineNo) + ":reAssignmentModeR.matched : " + line)
							pass
						elif reEvtAttrId.match(line):
							#print("reEvtAttrId.matched" + line)
							log.write(str(lineNo) + ":reEvtAttrId.matched : " + line)
							split = line.split("EVT_ATTR_ID")
							newline = split[0] + avpReplace[pattern]
							new_content += newline
						else:
							new_content += line
						
						lineNo += 1
						line = f.readline()
						
			if patternMatched == False:
				new_content += line
					
			lineNo += 1
			line = f.readline()
			
		f.close()
		
		fout = open(file, "w")
		fout.write(new_content)
		fout.close()
		log.write("close file:" + file + " Finished\n")
			
	log.close()
	
if __name__ == '__main__':
	cwd = os.getcwd()
	files = findAllFile(cwd)
	files = filterExtension(files, '.diamEncoding')
	#print(files)
	avpReplace = avpReplaceDefination()
	replaceFilesWithAvp(files, avpReplace)
	print("Replace finished, please refer to replaceAVP.py.log")
	


	
	
	
	
	
	
