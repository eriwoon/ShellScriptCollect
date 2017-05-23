#! /usr/bin/python
import os
import sys


'''insert into bp_Node (NODE_ID, NODE_TYPE, NE_TYPE, NODE_FLOAT_IP, DATA_SOURCE, DS_GROUP, BIND_APP_NODE_ID_LIST, DOMAIN_ID, SITE_ID, NODE_DESC, NODE_STATUS, REMOTE_NODE_ID, NODE_LOCATION, RW_MODE, BIND_APP_POOL_ID)
values ('1511', 'D', '', '10.88.163.39', 'LOG_USER_PDB_DS_1511', 'LOG_USER_PDB_DSGRP', '481', '1', '1', 'LOG_USER_PDB_DS_1511', '1', '', '0', '2', '0');'''

def main():
    f = open('C:/Program Files/eSpace-ecs/UserData/x00194181/ReceiveFile/bp_node_sort.csv')
    for line in f.readlines():
        sp = line.split(',')
        print "insert into bp_Node (NODE_ID, NODE_TYPE, NE_TYPE, NODE_FLOAT_IP, DATA_SOURCE, DS_GROUP, BIND_APP_NODE_ID_LIST, DOMAIN_ID, SITE_ID, NODE_DESC, NODE_STATUS, REMOTE_NODE_ID, NODE_LOCATION, RW_MODE, BIND_APP_POOL_ID)values (\
'" + sp[0] + "'\
, '" + sp[1] + "'\
, '" + sp[2] + "'\
, '" + sp[3] + "'\
, '" + sp[4] + "'\
, '" + sp[5] + "'\
, '" + sp[6] + "'\
, '" + sp[7] + "'\
, '" + sp[8] + "'\
, '" + sp[9] + "'\
, '" + sp[10] + "'\
, '" + sp[11] + "'\
, '" + sp[12] + "'\
, '" + sp[13] + "'\
, '" + sp[14][:-1] + "');"

if __name__ == '__main__':
    os.chdir(os.path.dirname(sys.argv[0]))
    main()