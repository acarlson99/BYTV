#!/bin/env python3

# print `img.bmp` data

file = open('img.bmp', mode='r')

s = list(map(ord, file.read()))

file.close()

data = s[26:-2]

l = []

for a in range(len(data[0:-2])):
    if (a%3 != 0):
        continue
    l.append((data[a],data[a+1],data[a+2]))

def split(list_a, chunk_size):
    for i in range(0, len(list_a), chunk_size):
        yield list_a[i:i + chunk_size]

l2 = list(split(l, 27))

size = 1

def f(x):
    if x[0] == 0 and x[2] == 255: # red
            return '\033[41m \033[0m'*size*2
    elif x[2] == 0: # black
            return ' '*size*2
    else: # white
            return '\033[1;47m \033[0m'*size*2

for a in list(map(lambda x: ''.join(list(map(f, x))), l2)):
    for n in range(size):
        print(a)
