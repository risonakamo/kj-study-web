/** truncate a string to a percent length, rounded up. percent should be 0-1 */
export function percentTruncate(input:string,size:number):string
{
    const newSize:number=Math.ceil(input.length*size);

    return input.slice(0,newSize);
}