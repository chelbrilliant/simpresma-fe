<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>SIMPRESMA</title>

    @viteReactRefresh
    @vite('resources/js/main.tsx')
</head>

<body class="dark:bg-gray-900">
    <div id="root"></div>
</body>
</html>
