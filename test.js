// //Obtener las dimenciones del arreglo
// //Si el arreglo es de dos o más dimenciones entonces continuar
// const arr = [[0, 1, 1, 2], 
//           [0, 5, 0, 0], 
//           [2, 0, 3, 3]]
// const solution=(arr)=>{
//     let dim = 0;
//     // const sut =[]
//     let result = 0;
//     arr.map(el=>{
//         if( typeof(el)==="object" ){
//             return dim+=1;
//         }
//     })
//     if(dim>1){
//         let counter = 0;
//         for(let a=0; a<dim; a++){
//             // const sut =[]

//             for( let i = 0; i<arr[a].length; i++){
//                 // sut.push( arr[a][i] );
//                 if(a > 0){
//                     if( arr[a-1][i] !=0 ){
//                         result += arr[a][i];
//                         console.log(result);
//                     }
//                 }
                
//             }

//             // console.log(sut);

//         }
        
//         // console.log(sut);
//     }
//     return result;

    
// }
// solution(arr);
// // console.log(solution(arr));

console.log("1".charCodeAt(0).toString(16));