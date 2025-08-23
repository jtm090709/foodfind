def solution(N,K,A):
    arr=[]
    A.sort()
    for i in range(N):
        n=0
        for j in range(N):
            if A[i]==A[j]:
                n+=1
        a=0
        for k in arr:
            if k==[A[i],n]:
                a+=1
            arr.append([A[i],n])
        if len(arr)==0:
            arr.append([A[i],n])
    return arr


N,K=input().split()
A=list(map(int,input().split()))

print(solution(int(N),int(K),A))