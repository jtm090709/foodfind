def solution(N,K,A):
    arr=[]
    for i in A:
        n=0
        for j in A:
            if i==j:
                n+=1
        arr.append([i,n])
    arr2=set(map(tuple,arr))
    for i in range(len(arr2)):
        arr3=arr2.copy()
        for j in range(4-arr2[i][1]):
            n=1
            if arr2[i][0]+n in arr3:
                

    return arr2



N,K=input().split()
A=list(map(int,input().split()))

print(solution(int(N),int(K),A))