<script>
    export let data;
    let message = "";
</script>
<div class="Main">
    <br>
    <h1>GPT-4 Chabot</h1>
    <div class="Messages">
        {#each data?.history as item}
            {@html item.content}
            <br>
            <br>
        {/each}
        {#if data?.history.length == 0}
        <p>No messages</p>
    {/if}
    </div>
    <form action="#" method="post">
        <input type="text" name="message" bind:value={message} />
        <button type="submit">Submit</button>
    </form>
    <br>
</div>