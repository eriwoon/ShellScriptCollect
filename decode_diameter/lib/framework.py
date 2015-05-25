#!/usr/bin/env python
from __future__ import unicode_literals, print_function, division

from Tkinter import *
import tkFileDialog, tkMessageBox
from ttk import *
from tkframwork.MyCanvasList import MyCanvasList

class myWindow(Frame):
    def __init__(self, master=None,width=100, height=100):
        Frame.__init__(self, width = width, height = height)

        self.createWidgets()
        self.bind_all("<Escape>", self.onClickEscape)

    def createWidgets(self):
        '''Command items in the left'''
        self.leftFrame = Frame(self)
        self.cvButton = Button(self.leftFrame, text = 'ClickMe', command = self.onClickResize, width = 15)
        self.cvButton.pack(side = 'top')
        #self.fileSelectBox = ExFileSelectBox(self.leftFrame, directory = 'c:\\')
        #self.fileSelectBox.pack(side = 'top')
        self.leftFrame.pack(side = 'left', ipadx = 1)

        '''Flow in the middle'''
        self.flow = Canvas(self, bg='white', width = 300)
        self.leftLine = None
        self.canvasLines = []

        Widget.bind(self.flow, "<Configure>", self.drawCanvas)
        self.flow.pack(side = 'left', fill='y', ipadx = 1)

        '''Text in the right'''
        self.text_out = Text(self, wrap=NONE)
        self.text_out.insert('1.0','AVP tree will show here')
        self.scry = Scrollbar(self)
        self.scrx = Scrollbar(self)
        self.text_out.config(yscrollcommand=self.scry.set, xscrollcommand=self.scrx.set)
        self.scry.config(command=self.text_out.yview)
        self.scrx.config(command=self.text_out.xview)
        self.text_out.pack(side = 'left', fill = 'y')


    def drawCanvas(self, event = 0):
        #create resize line
        if self.leftLine == None:
            self.leftLine = self.flow.create_line(self.flow.winfo_width() - 5, 0, self.flow.winfo_width() - 5, self.flow.winfo_height(), width = 2, fill="grey")
            self.flow.tag_bind(self.leftLine, "<Any-Enter>", self.leftLineMouseEnter)
            self.flow.tag_bind(self.leftLine, "<Any-Leave>", self.leftLineMouseLeave)
            self.flow.tag_bind(self.leftLine, "<Button-1>", self.leftLineMouseDown)
            self.flow.tag_bind(self.leftLine, "<B1-Motion>", self.leftLineMouseMove)

            self.text_out.config(width = self.winfo_width() - self.leftFrame.winfo_width() - self.flow.winfo_width())

        myCanvasList = MyCanvasList('1.pcap')

        #clear existing items
        for i in self.canvasLines:
            self.flow.delete(i)
        #store the lines, used to delete them when refreshed
        self.canvasLines = []
        #store the pos of the lines, used for draw horizontal lines
        self.nodePos = []

        #create host name and vertical lines
        for i in range(len(myCanvasList.nodes)):
            pos = 50 + (self.flow.winfo_width() - 100) // (len(myCanvasList.nodes)-1) * i
            self.nodePos.append(pos)
            lenth = len(myCanvasList.lines) * 100 + 20
            #create host name
            self.canvasLines.append(self.flow.create_text((pos,10),text = myCanvasList.nodes[i], anchor = 'center'))
            #create vertical lines
            self.canvasLines.append(self.flow.create_line(pos, 20, pos, lenth, width =  6,fill = 'blue'))
            self.flow.tag_bind(self.canvasLines[-1], "<Any-Enter>", self.canvasMouseEnter)
            self.flow.tag_bind(self.canvasLines[-1], "<Any-Leave>", self.canvasMouseLeave)
            self.flow.tag_bind(self.canvasLines[-1], "<Button-1>", lambda event,text = myCanvasList.nodes[i]: self.setText(text))

        #create horizontal lines
        START = 'start'
        END   = 'end'
        TEXT  = 'text'
        for i in range(len(myCanvasList.lines)):
            vpos = 50 + i * 100
            self.canvasLines.append(self.flow.create_line(self.nodePos[myCanvasList.lines[i][START]], vpos, self.nodePos[myCanvasList.lines[i][END]], vpos, width =  6,fill = 'blue', arrow='last'))
            self.flow.tag_bind(self.canvasLines[-1], "<Any-Enter>", self.canvasMouseEnter)
            self.flow.tag_bind(self.canvasLines[-1], "<Any-Leave>", self.canvasMouseLeave)
            self.flow.tag_bind(self.canvasLines[-1], "<Button-1>", lambda event,text = myCanvasList.lines[i][TEXT]: self.setText(text))


    #event handling
    def leftLineMouseEnter(self, event):
        self.config(cursor="sb_h_double_arrow")
    def leftLineMouseLeave(self, event):
        self.config(cursor="")
    def leftLineMouseDown(self, event):
        # remember where the mouse went down
        self.lastx = event.x
        self.lasty = event.y
    def leftLineMouseMove(self, event):
        # whatever the mouse is over gets tagged as CURRENT for free by tk.
        self.flow.move(CURRENT, event.x - self.lastx, 0)
        self.flow.config(width = event.x )
        self.lastx = event.x
        self.lasty = event.y

    def canvasMouseEnter(self, event):
        self.config(cursor="hand2")
    def canvasMouseLeave(self, event):
        self.config(cursor="")
    def canvasMouseDown(self, event):
        # remember where the mouse went down
        pass

    def onClickEscape(self, key):
        self.master.quit()
    def onClickResize(self):
        filename = tkFileDialog.askopenfilename(filetypes = (("Template files", "*.tplate")
                                                         ,("HTML files", "*.html;*.htm")
                                                         ,("All files", "*.*") ))
        if filename:
            try:
                self.settings["template"].set(filename)
            except:
                tkMessageBox.showerror("Open Source File", "Failed to read file \n'%s'"%filename)
                return

    def setText(self, text):
        self.text_out.delete('1.0','end')
        self.text_out.insert('1.0', text)
def main():
    root = Tk()
    root.geometry('1024x600')
    win = myWindow(root)

    #set the gird info
    #win.grid(row=0,column=0,sticky=N+S+E+W)
    #root.rowconfigure(0,weight = 1)
    #root.columnconfigure(0, weight = 1)

    win.pack(expand = 'yes', fill = 'both')
    root.title("TraceReader")
    #root.iconbitmap('1.ico')
    root.mainloop()

if __name__ == '__main__':
    main()
