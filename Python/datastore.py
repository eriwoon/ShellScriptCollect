#! /usr/bin/python
#coding: utf-8

fields = {}
fields["brand"] = (
    [
        #BrandId    #BrandType  #BE_ID  #BE_CODE
        [380043552, 0,          103,    '103']
    ])
    
fields["BrandTypes"] = (
    [
        #name       #offset
        ["pps",     0],
        ["lca",     1],
        ["mctu",    2],
        ["mvno",    3]
    ])

fields["prefix"] = (
    [   #prefix     squence                         eventid+cdrType                     data_store_id start number
        ["rec",     "SEQ_FILE_SEQ_REC",             [[1101, 1]],                        1000000],
        ["sms",     "SEQ_FILE_SEQ_SMS",             [[1102, 1]],                        1000010],
        ["mms",     "SEQ_FILE_SEQ_MMS",             [[1103, 1]],                        1000020],
        ["data",    "SEQ_FILE_SEQ_DATA",            [[1104, 1]],                        1000030],
        ["com",     "CDRSERIALNO_NORMAL_COM_PPS",   [[1206, 1]],                        1000040],
        ["mgr",     "SEQ_FILE_SEQ_MGR",             [[1304, 4], [1329, 1]],             1000050], 
        ["vou",     "SEQ_FILE_SEQ_VOU",             [[1302, 2], [1306, 1], [1350, 2]],  1000060],
        ["Dump",    "SEQ_CDR_ID",                   [[1415, 1]],                        1000070],
        ["clr",     "SEQ_FILE_SEQ_CLR",             [[1408, 1]],                        1000080],
        ["mon",     "SEQ_FILE_SEQ_MON",             [[1401, 1]],                        1000090],
        ["b_modif", "SEQ_CDR_ID",                   [[1, 6, 20000]],                    1000100],
        ["b_del"   ,"SEQ_CDR_ID",                   [[1, 6, 20001]],                    1000110],
        ["b_create","SEQ_CDR_ID",                   [[1, 6, 20002]],                    1000120]
    ])

def create_BP_DATA_STORE():
    print "delete from BP_DATA_STORE where DATA_STORE_ID >= 1000000;"
    for prefix in fields["prefix"]:
        for brand in fields["BrandTypes"]:
            #dump话单的目录是在${CBP_CDRPATH}/output/{BrandID}/dump
            if(prefix[0] == "dump"):
                print "insert into BP_DATA_STORE values ('" + str(prefix[3] + brand[1]) + "', 'R5_" + prefix[0] + "', '.unl', '36700160', '100000', '600', '${CBP_CDRPATH}/output/" + brand[0] + "/dump', '${CBP_CDRPATH}/output/" + brand[0] + "/dump/temp', 'Y', 'Y');"
            #对于b_开头的BMP话单,是在${HOME}/cdr/output/{BrandID}/normal
            elif prefix[0][:2] == 'b_':
                print "insert into BP_DATA_STORE values ('" + str(prefix[3] + brand[1]) + "', 'R5_" + prefix[0] + "', 'unl', '36700160', '100000', '600', '${HOME}/cdr/output/" + brand[0] + "/normal', '${HOME}/cdr/output/" + brand[0] + "/normal/temp', 'N', 'Y');"
            else:
                print "insert into BP_DATA_STORE values ('" + str(prefix[3] + brand[1]) + "', 'R5_" + prefix[0] + "', '.unl', '36700160', '100000', '600', '${CBP_CDRPATH}/output/" + brand[0] + "/normal', '${CBP_CDRPATH}/output/" + brand[0] + "/normal/temp', 'Y', 'Y');"
    
def modify_EF_CDR_OUCTPUT_CFG():
    for prefix in fields["prefix"]:
        DATA_STORE_ID = prefix[3]
        for event in prefix[2]:
            STD_EVT_TYPE_ID = event[0]
            if STD_EVT_TYPE_ID == 1:
                CDR_FILE_OUT_ID = event[2]
            else:
                CDR_FILE_OUT_ID = STD_EVT_TYPE_ID
                
            NORMAL_DATA_STORE_ID = DATA_STORE_ID
            ERROR_DATA_STORE_ID  = DATA_STORE_ID
            RERATING_DATA_STORE_ID = DATA_STORE_ID
            
            if STD_EVT_TYPE_ID != 1 :
                ERROR_ORI_DATA_STORE_ID = 103
                ROLLBACK_DATA_STORE_ID  = 108
            else:
                ERROR_ORI_DATA_STORE_ID = DATA_STORE_ID
                ROLLBACK_DATA_STORE_ID  = DATA_STORE_ID
            
            #修改现有的数据
            print "update ef_cdr_output_cfg set NORMAL_DATA_STORE_ID = %d, ERROR_DATA_STORE_ID = %d, RERATING_DATA_STORE_ID = %d, ERROR_ORI_DATA_STORE_ID = %d, ROLLBACK_DATA_STORE_ID = %d where CDR_FILE_OUT_ID = %d;"\
              %(NORMAL_DATA_STORE_ID,
                ERROR_DATA_STORE_ID,
                RERATING_DATA_STORE_ID,
                ERROR_ORI_DATA_STORE_ID,
                ROLLBACK_DATA_STORE_ID,
                CDR_FILE_OUT_ID)
                

def create_EF_CDR_OUCTPUT_CFG():
    REC_ID = 1000000
    print "delete from ef_cdr_output_cfg where rec_id >= 1000000;"

    for brand in fields["brand"]:
        BRAND_ID = brand[0]
        BE_ID = brand[2]
        BE_CODE = brand[3]
        DATA_STORE_ID_offset = brand[1]
        
        for prefix in fields["prefix"]:
            SEQ_NORMAL_CDR_ID = prefix[1]
            DATA_STORE_ID = prefix[3] + DATA_STORE_ID_offset
            for event_cdrType in prefix[2]:
                STD_EVT_TYPE_ID = event_cdrType[0]
                
                if STD_EVT_TYPE_ID != 1:
                    CDR_FILE_OUT_ID = STD_EVT_TYPE_ID
                else:
                    CDR_FILE_OUT_ID = event_cdrType[2]
                
                CDR_FILE_OUT_TYPE = event_cdrType[1]
                
                NORMAL_DATA_STORE_ID = DATA_STORE_ID
                ERROR_DATA_STORE_ID  = DATA_STORE_ID
                RERATING_DATA_STORE_ID = DATA_STORE_ID
                if STD_EVT_TYPE_ID != 1 :
                    ERROR_ORI_DATA_STORE_ID = 103
                    ROLLBACK_DATA_STORE_ID  = 108
                else:
                    ERROR_ORI_DATA_STORE_ID = DATA_STORE_ID
                    ROLLBACK_DATA_STORE_ID  = DATA_STORE_ID
                    
                print "insert into ef_cdr_output_cfg values (%d, '%d', %d, '%s', '%s', %d, %d, %d, %d, '%s', %d, %d, '%s', '%s', %d, %d, '%s', '%s');" \
                  %(CDR_FILE_OUT_ID,
                  CDR_FILE_OUT_TYPE,
                  STD_EVT_TYPE_ID,
                  '*', #PAYMENT_MODE,
                  'N', #TEST_CDR_FLAG,
                  NORMAL_DATA_STORE_ID,
                  ERROR_DATA_STORE_ID,
                  ERROR_ORI_DATA_STORE_ID,
                  BE_ID,
                  BE_CODE,
                  RERATING_DATA_STORE_ID,
                  ROLLBACK_DATA_STORE_ID,
                  '', #COND_EXPR_TEXT,
                  '', #COND_EXPR_CODE,
                  BRAND_ID,
                  REC_ID,
                  "SEQ_ERR_CDR_ID", #SEQ_ERR_CDR_ID,
                  SEQ_NORMAL_CDR_ID)
                
                REC_ID += 1
            
if __name__ == '__main__':
    create_BP_DATA_STORE()
    modify_EF_CDR_OUCTPUT_CFG()
    create_EF_CDR_OUCTPUT_CFG()
