def solution(N,K,A):
    arr=[]
    arr2=[]
    ans=0
    A.sort()
    for i in range(N):
        n=0
        for j in range(N):
            if A[i]==A[j]:
                n+=1
        arr.append(n)
    arr.sort()
    m=arr[len(arr)-1]
    for i in range(N):
        n=0
        for j in range(N):
            if A[i]==A[j]:
                n+=1
            if n==m:
                b=1
                while not(i-b in A) or not(i+b in A):
                    b+=1
                arr2.append(b)
    return arr2

N,K=input().split()
A=list(map(int,input().split()))

print(solution(int(N),int(K),A))