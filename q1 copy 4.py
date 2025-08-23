def solution(N,K,A):
    arr=[]

    ans=0
    for i in range(N):
        n=0
        for j in range(N):
            if A[i]==A[j]:
                n+=1

        b=1
        while not((i-b in arr3) or (i+b in arr3)):
            b+=1
        if i-b in arr3:
            arr3.remove(i-b)
        elif i+b in arr3:
            arr3.remove(i+b)
        c+=b
        arr.append(c)
    arr.sort()
    return arr[0]

N,K=input().split()
A=list(map(int,input().split()))

print(solution(int(N),int(K),A))