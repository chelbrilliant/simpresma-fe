<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title>SIMPRESMA</title>

    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')('resources/js/main.tsx'); ?>
</head>

<body class="dark:bg-gray-900">
    <div id="root"></div>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\simpresma-v5-up\resources\views/app.blade.php ENDPATH**/ ?>