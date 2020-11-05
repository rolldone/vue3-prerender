import defineRecursiveMiddleware from './RecursiveMiddleware.jsx';
export default async function(middlewares,to,the_from,next){
	var startIndex = 0;
	let theNewMiddleware = await defineRecursiveMiddleware(startIndex,to,the_from,next,middlewares);
	if(theNewMiddleware != null){
		return theNewMiddleware();
	}
	if(next != null){
		return next();
	}
};

