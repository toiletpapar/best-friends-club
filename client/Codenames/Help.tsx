import * as React from 'react'

const Help = (): JSX.Element => {
  return (
    <div>
      <section>
        <h2>Setup</h2>
        <p>Players split up into two teams of similar size and skill. You need at least four players (two teams of two) for a standard game. Variants for two or three players can be found in the sections below. Each team chooses one player to be their spymaster.</p>
      </section>
      <section>
        <h2>The Key</h2>
        <p>Each game has one key that reveals the secret identities of the cards in the grid (this is shown in the top-right corner for spymasters). Blue squares correspond to words that Blue Team must guess (blue agents). Red squares correspond to words that Red Team must guess (red agents). Pale squares are innocent bystanders, and the black square is an assassin who should never be contacted at all!</p>
      </section>
      <section>
        <h2>Game Overview</h2>
        <p>Spymasters have access to the key and know the secret identities of 25 agents. Their teammates know the agents only by their codenames.</p>
        <p>Spymasters take turns giving one-word clues. A clue may relate to multiple words on the table. The field operatives try to guess which words their spymaster menat. When a field operative clicks a word, the spymaster reveals its secret identitiy. If the field operatives guess correctly, they may continue guessing, until they run out of ideas for the given clue or until they hit a wrong person. Then it is the other team&apos;s turn to give a clue and guess. The first team to contact all their agents wins the game.</p>
      </section>
      <section>
        <h2>Gameplay</h2>
        <p><strong>Teams take turns.</strong> The current turn is displayed on the scoreboard in the top left.</p>
      </section>
      <section>
        <h2>Giving a Clue</h2>
        <p>If you are the spymaster, you are trying to think of a one-word clue that relates to some of the words your team is trying to guess. When you think you have a good clue, you say it. You also say one number, which tells your teammates how many codenames are related to your clue.</p>
        <p><strong>Example:</strong> Two of your words are NUT and BARK. Both of these grow on trees, so you say <i>tree: 2</i></p>
        <p>You are allowed to give a clue for only one word (<i>cashew: 1</i>) but it&apos;s fun to try for two or more. Getting four words with one clue is a big accomplishment.</p>
      </section>
      <section>
        <h2>One word</h2>
        <p>Your clue must be only one word. You are not allowed to give extra hints. For example, don&apos;t say, &#34;This may be a bit of a stretch...&#34; You are playing Codenames. It&apos;s always a bit of a stretch.</p>
        <p>Your clue cannot be any of the codenames visible on the table. On later turns, some codenames will be covered up, so a clue that is not legal now might be legal later.</p>
      </section>
    </div>
  )
}

export {
  Help
}
