function maxDrawdown(data){
    let maxAcum = data.map(function (e,i) {
        return Math.max(...data.slice(0, i+1))
    });
    let drawDown = maxAcum.map(function(val,idx){
        return (data[idx] - val) / val
    })
    return Math.max.apply(null,drawDown.map(Math.abs))
}

function accumulativeReturn(data){
    let end = data.length -1
    return (data[end] / data[0]-1)
}


// 修正： 365.25/daysSpan 和旧的225/daysSpan会存在日子差，导致两个版本的annualReturn存在不一致输出
// 所以跑annualReturn 之前输入一下getDateRange拿到运算新的daysSpan 去运算annual return
function annualReturn(data, daysSpan){
    // let daysSpan = data.length -1
    let accReturn = accumulativeReturn(data)
    return Math.pow((1+accReturn),365.25/daysSpan) - 1
}

function getDateRange(start, end){
    let start_date = new Date(start)
    let end_date = new Date(end)
    return Math.ceil(Math.abs(start_date - end_date) / (1000 * 60 * 60 * 24)) + 2;
}


function pct_change(data){
    let output = []
    for (let i = 0; i < data.length -1; i++){
        let x = (data[i+1] -data[i])/ data[i]
        if (x !== 0){
            output.push(x)
        }
    }
    return output
}

//这个跟python 的自带包std()会存在一定的数差
function standardDeviation(data){
    let avg = data.reduce((acc,value)=>{
        return acc + value;
    }, 0)/data.length;

    data = data.map((k)=>{
        return (k-avg) ** 2
    })

    let sum = data.reduce((acc,curr) => acc + curr, 0);

    let variance = sum/data.length

    return Math.sqrt(variance)
}

function annualVolatility(data){
    return standardDeviation(pct_change(data)) * Math.sqrt(252)
}

function sharpeRatio(data, start, end){
    let anReturn = annualReturn(data, getDateRange(start,end))
    let rfRate = 0
    let anVol = annualVolatility(data)

    return (anReturn-rfRate) / anVol
}