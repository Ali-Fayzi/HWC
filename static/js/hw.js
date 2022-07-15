var model = null
    window.addEventListener('load',async ()=>{
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* Drawing on Paint App */
        SetCanvasDefault(ctx)

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint);
        });

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint);
        });

        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
        };
        model = await tf.loadLayersModel("http://127.0.0.1:5500/model/model.json")
        model.summary()
    })
    var canvas = document.querySelector('#paint');
    var ctx = canvas.getContext('2d');
    var result_tag = document.querySelector("#result")

    function SetCanvasDefault(ctx){
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    function ClearCanvas(canvas){
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    async function predict(){
        var image = tf.browser.fromPixels(canvas).resizeBilinear([32,32]).div(255)
        image =tf.expandDims(image, 0);
        let result = model.predict(image)
        let data = {
            0:'الف',
            1:'ب',
            2:'د',
            3:'ج',
        }
        console.log(result.dataSync())
        result_tag.innerHTML = data[tf.argMax(result.dataSync()).dataSync()[0]]
    }
    function Clear(){
        ClearCanvas(canvas)
        SetCanvasDefault(ctx)
        result_tag.innerHTML = ''
    }