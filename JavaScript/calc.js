#! /usr/bin/nodejs
var assert = require("assert");

//solve linear equation group
function transform(equations) {
	var isChar = function(c){
		if((c >= "a" && c<= "z") || (c >= "A" && c<= "z")) return true;
		else return false;
	};

	for (let i in equations){
		let equation = equations[i];
		//step 1, transfer all patameter to left
		var splitted = equation.split("=");
		assert(splitted.length == 2, "All input must be euqations, this is not:" + equation + ".");

		equation = splitted[0] + "-(" + splitted[1] + ")";
		console.log(equation);

		//step 2, postfix expression transform
		var poexp = [], operatorStack = [];
		var factor = "";
		var operators = {"+":"+", "-":"-", "*":"*", "/":"/", "(":"(", ")":")"};

		for( let it in equation){
			let c = equation[it];
			if(c== " ") 
				continue;

			if(c in operators){
				if(factor != ""){
					poexp.push(parseFloat(factor));
					factor = "";
				}

				if(c == "(") 
					operatorStack.push(c);
				else if(c=="*" || c=="/"){
					while(operatorStack.length > 0 && (operatorStack[operatorStack.length - 1] == "*" || operatorStack[operatorStack.length - 1] == "/"))
						poexp.push(operatorStack.pop());
					operatorStack.push(c);
				}
				else if(c=="+" || c == "-"){
					while(operatorStack.length > 0 && operatorStack[operatorStack.length -1] != "(")
						poexp.push(operatorStack.pop());
					operatorStack.push(c);
				}
				else if(c==")"){
					while(operatorStack[operatorStack.length -1] != "(")
						poexp.push(operatorStack.pop());
					operatorStack.pop();
				}

			}
			else if ((c >= 0 && c<= 9) || c == "."){
				factor += c;
			}
			else if(isChar(c))
				poexp.push(c);
			else{

				assert(false, "unexpected operators:" + c + ".");
			}
		}
		while(operatorStack.length)
			poexp.push(operatorStack.pop());
		console.log(poexp);

		//step 3: caculate
		let stack = [];
		var varType = function(factor){
			this.set(factor);
		};
		varType.prototype.set = function(factor){
			if(isChar(factor))
				this[factor] = 1;
			else
				this[1] = factor;
		};
		varType.prototype.calc = function(operator, factor){
			switch(operator){
				case "+":
					for(let i in factor)
						if(i in this)
							this[i] += factor[i];
						else
							this[i] = factor[i];
						return this;
					//break;
				case "-":
					for(let i in factor)
						if(i in this)
							this[i] -= factor[i];
						else
							this[i] = 0 - factor[i];
						return this;
					break;
				case "*":
					assert((("1" in this && Object.keys(this) == 1) || ("1" in factor && Object.keys(factor) == 1)),
						"Don't support multi-demension functions.");
					if("1" in this && Object.keys(this) == 1){
						for(let i in factor)
							factor[i] *= this[1];
						return factor;
					}
					else
						for(let i in this)
							this[i] *= factor[1];
						return this;
					break;
				//just support format like 12 * a / 5
				case "/":
					assert((("1" in this && Object.keys(this) == 1) || ("1" in factor && Object.keys(factor) == 1)),
						"Don't support multi-demension functions.");
					assert(("1" in factor && Object.keys(factor) == 1),	"just support format like 12 * a / 5.");
					for( let i in this){
						this[i] /= factor[i];
					}
					return this;
					break;
			}
		};
		let left = undefined, right = undefined;
		for(let i in poexp ){
			let exp = poexp[i];
			console.log(exp);
			console.log(stack);

			if(exp in operators){
				right = stack.pop();
				left = stack.pop();

				stack.push(left.calc(right));
			}
			else
				stack.push(new varType(exp));			
		}
	}
}


function main() {
	console.log("Hello world!");
	var equations = [
		"1000 * 0.05 + a = (1000 - a)*0.05 + b",
		"a + b = 1000"];

	transform(equations);



}



main(process.argv);