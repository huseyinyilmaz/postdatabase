class Util:
    def strToJSStr(self,value):
        result = value
        result = result.replace('\\','\\\\')
        result = result.replace('\'','\\\'')
        result = result.replace('"','\\"')
        #result = result.replace('&amp;#','&#')
        result = result.replace('\n','\\n');
        return result         
    