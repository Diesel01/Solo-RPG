//Firebase auth
const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn"); 
const whenSignedOut = document.getElementById("whenSignedOut"); 

const signInBtn = document.getElementById("signInBtn"); 
const signOutBtn = document.getElementById("signOutBtn"); 

const userDetails = document.getElementById("userDetails"); 

const provider = new firebase.auth.GoogleAuthProvider(); 

signInBtn.onclick = () => auth.signInWithPopup(provider); 
signOutBtn.onclick = () => auth.signOut(); 


auth.onAuthStateChanged(user =>{
    if (user) {
        //signed in 
        whenSignedIn.hidden = false; 
        whenSignedOut.hidden = true; 
        userDetails.innerHTML = `<h3>Olá ${user.displayName}!</h3>`; 
    } else {
        //not signed in 
        whenSignedIn.hidden = true; 
        whenSignedOut.hidden = false; 
        userDetails.innerHTML = `<h3>Olá!</h3> <p>Inscreva-se para começar</p>`; 
    }
})

//Firebase database 
const db = firebase.firestore(); 
const firstBtn = document.getElementById("firstBtn"); 
const opt1 = document.getElementById("a1"); 
const opt2 = document.getElementById("b1"); 
const opt3 = document.getElementById("c1"); 

let questionRef; 
let unsubcribe; 

auth.onAuthStateChanged(user => {
    if (user){
        console.log("hi there")
        questionRef = db.collection("choices"); 
        firstBtn.onclick = () =>{
            // const {serverTimestamp} = firebase.firestore.FieldValue(); 
            questionRef.add({
                uid: user.uid, 
                question: "q1", 
                optA: opt1.checked, 
                optB: opt2.checked, 
                optC: opt3.checked, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
        }
        // unsubcribe = questionRef
        //     .where("uid", "==", user.uid)
        //     .onSnapShot(querySnapshot => {
        //         const items = querySnapshot.docs.map(doc => {
        //             return 
        //         })
        //     })
    }else {
        unsubcribe && unsubcribe();
    }
})

////////////////////////////////////////////////////////////////
// App 
function question1Conseqs (){
    let optA = document.getElementById("a1"); 
    let optB = document.getElementById("b1");
    let optC = document.getElementById("c1");
    
    if (optA.checked){
        document.getElementById("questao3").style.display = "block"
    }else if (optB.checked){
        document.getElementById("questao"+2).style.display = "block"
    }else if (optC.checked){
        document.getElementById("questao"+4).style.display = "block"
    }

    document.getElementById("firstQuestion").style.display = "none"
}
document.getElementById("firstBtn").addEventListener("click", question1Conseqs); 

const modalFactory = (qId, situation, options, conseqs) =>{
    const temp = document.getElementsByTagName("template")[0]; 
    let questionTemp = temp.content.firstElementChild.cloneNode(true); 
    document.body.appendChild(questionTemp); 
    
    questionTemp.id = "questao"+qId

    questionTemp.querySelector("#situaçao").innerHTML = situation; 
    
    let respostasForm = questionTemp.querySelector("#respostasForm"); 
    for (let i = 0; i< options.length; i++){
        let optionSelector = document.createElement("input"); 
            optionSelector.className = "respostas"; 
            optionSelector.type = "radio"; 
            optionSelector.id = "questao"+qId + "-" + i;
            optionSelector.name = "resposta"+qId;
        
        let optionLabel = document.createElement("label"); 
            optionLabel.className = "respostaLabel";
            optionLabel.htmlFor = "questao"+qId + "-" + i; 
            optionLabel.innerHTML = options[i];
        
        respostasForm.appendChild(optionSelector);
        respostasForm.appendChild(optionLabel);   
    }
    
    const conseqFunction = () =>{
        let optionSelectorColec = questionTemp.querySelectorAll("input")
        for (let index = 0; index < optionSelectorColec.length; index++) {
            if (optionSelectorColec[index].checked){
                document.getElementById("questao"+conseqs[index]).style.display = "block"
            };
        }
    }

    let thisBtn = questionTemp.querySelector(".submit");
        thisBtn.addEventListener("click", function(){
            conseqFunction(); 
            questionTemp.style.display = "none"; 
        })

    return { qId, situation, options, conseqs, conseqFunction, thisBtn } 
} 

const q1 = modalFactory(1, "O seu celular desperta no horário programado, porém você não está com disposição para levantar da cama. É possível dormir mais meia hora, mas isso custaria o tempo de tomar banho e tomar café da manhã. O que você faz?",
["Levanta, mesmo sem disposição, para não se atrasar", "Dorme mais meia hora na função soneca.", "Ignora o despertador."],
[3, 2, 4]);

const q2 = modalFactory(2, "Quando você levanta da cama já não resta muito tempo para se arrumar. É necessário escolher entre tomar café da manhã e banho ou chegar na aula com atraso. Qual sua escolha?", 
["Chega atrasado, sem fome e de banho tomado.", "Sai sem café e sem tomar banho para chegar no horário"], 
[10, 3]);

const q3 = modalFactory(3, "Você sai de casa no horário e chega a tempo de pegar ônibus costumeiro. No ônibus existe apenas um lugar vago, é uma vaga preferencial, mas não há mais ninguém em pé. Você senta nesse acento?",
["Sentar no acento preferencial", "Continuar a viagem em pé."], 
[5, 7]);

const q4 = modalFactory(4, "Você achou que poderia acordar há tempo mesmo sem a opção soneca e acabou perdendo um dia de aula, com o que você mais se preocupa? ", 
["Com a reação dos seus pais.", "Em recuperar o conteúdo da aula que não compareceu", "Não se preocupa com nada, afinal o conteúdo nem é tão importante assim e você já está acostumado com os “sermões” em casa dos seus pais."], 
[11, 11, 11]);

const q5 = modalFactory(5, "Duas esquinas após você sentar, entra no ônibus uma senhora que aparenta estar na casa dos 70 anos de idade. Ela não apresenta nenhuma dificuldade de equilíbrio ou locomoção. O que você decide fazer?",
["Levanta e cede o lugar para a senhora.", "Continua sentado, pois ela não apresenta dificuldade em estar de pé."],
[7, 6]); 

const q6 = modalFactory(6, "lgumas pessoas que estão no ônibus olham para você com desaprovação pela atitude de não ceder o lugar, como você se sente?", 
["Acha que as pessoas não devem cuidar da sua vida e está tranquilo, afinal a senhora demonstrou ser bem saudável e não se importar", "Culpado(a) e com certo constrangimento, mas continua sentado(a)", "Cede o lugar para a senhora, mas apenas por pressão dos olhares de desaprovação."], 
[7, 7, 7]); 

const q7 = modalFactory(7, "Você chega a escola e tem sua aula como esperado. Bate o sinal para o intervalo, você está no pátio da escola agora, conversando com seus colegas. De repente passa na rua um carro com propaganda eleitoral e surge o assunto entre vocês sobre qual candidato cada um vai votar. Você diz que:", 
["Vai votar ", "Não vai votar"], 
[9, 9]); 

const q8 = modalFactory(8, "Eles reagem ao que você diz com uma bronca mais rigorosa. Ensinando o quão importante é ter disciplina e sobre a obrigatoriedade da escola. Você se defende argumentando que:", 
["Se morasse mais perto da escola poderia acordar mais tarde, tomar um banho, tomar seu café sem correr contra o tempo e ainda assim chegar no horário", " Se não precisasse fazer o próprio café, teria como sair alguns minutos mais cedo.", "Aceita a bronca quieto(a) afinal se contrariar ou inventar mais coisas pode ser ainda pior."],
[12, 12, 12]); 

const q9 = modalFactory(9, "Sua aula já terminou e você voltou para casa há tempo de almoçar com sua família. Após terminar o almoço tem de organizar a cozinha, obrigação essa que, segundo seus responsáveis é uma forma de contribuição com a vida social da casa já que, segundo eles, você só estuda. O dia de hoje está sendo demasiadamente cansativo e, além disso, foram muitos os utensílios utilizados para fazer o almoço.", 
["Você está com preguiça, mas vai lavar mesmo assim, pois sente que realmente é sua obrigação visto que você só estuda", "Não vai lavar, pois não acha justo que você precise lavar a louça que toda uma família sujou", "Vai lavar parcialmente, deixando as louças mais sujas e difíceis pra outra pessoa limpar.", "Lava a louça, pois é mais fácil do que receber bronca dos pais sobre disciplina e obrigações."], 
[13, 13, 13, 13]); 

const q10 = modalFactory(10, "Você sai de casa atrasado e chega no ponto de ônibus para pegar o primeiro ônibus que levar você próximo da escola. No ônibus existe apenas um lugar vago, é uma vaga preferencial, mas não há mais ninguém em pé. Você senta nesse acento?", 
["Sentar no acento preferencial.", "Continuar a viagem em pé"],
[5, 7]); 

const q11 = modalFactory(11, "Ao saber que você não foi a escola, seus pais dão um breve discurso lembrando o quanto é difícil mantê-lo na escola e como é importante estudar para ter um futuro melhor. Qual a sua reação?", 
["Sente-se mal por ter quebrado a confiança deles, diz que vai recuperar o conteúdo perdido e se desculpa.", "Questiona a importância da escola. Dizendo que não entende porque tem que estudar tanta coisa que nunca vai usar para nada.", " Reclama de ter que ouvir um discurso, afinal sempre foi um bom aluno e perder um dia de aula não fará diferença nenhuma, até porque vai recuperar o conteúdo logo", " Inventa uma desculpa como: Celular não despertou, etc..."], 
[12, 8, 12, 8]);

const q12 = modalFactory(12, "Após a breve discussão, vocês almoçam como de costume. Ao chegar à tarde você lembra que uma de suas atribuições é justamente a organização da cozinha, obrigação essa que, segundo seus responsáveis é uma forma de contribuição com a vida social da casa já que, segundo eles, você só estuda. O dia de hoje está sendo demasiadamente cansativo e, além disso, foram muitos os utensílios utilizados para fazer o almoço.", 
["Você está com preguiça, mas vai lavar mesmo assim, pois sente que realmente é sua obrigação visto que você só estuda.", "Não vai lavar, pois não acha justo que você precise lavar a louça que toda uma família sujou.", "Vai lavar parcialmente, deixando as louças mais sujas e difíceis pra outra pessoa limpar.", "Lava a louça, pois é mais fácil do que receber outra bronca dos pais sobre disciplina e obrigações."], 
[13, 13, 13, 13]); 

const q13 = modalFactory(13, "Está chegando à noite, você está de bobeira conversando com um amigo no whatsapp e ele lhe convida para uma festa que todos os teus amigos vão ir e vai ser imperdível. Quando ele pergunta se teus pais podem levar vocês na festa, você diz que seus pais te proibiram de ir. Seu amigo então, dá a ideia de irem escondidos. O que você faz?", 
["Você vai escondido mesmo assim.", "Você acha melhor ficar em casa e não desrespeitar seus pais."],
[15, 14]); 

const q14 = modalFactory(14, "Seus pais então lhe avisam que vão numa janta de família e você tem de ir junto. Vocês então chegam à casa de seus tios, passam a noite tranquilamente jantando, e você nota que seus pais estão bebendo muito e está chegando a hora de voltar pra casa. O que você sugere?", 
["Você pede para que seus pais peçam um táxi pois é mais seguro.", "Você diz a seus pais que se eles querem voltar dirigindo bêbados assim, você prefere posar na casa de seus tios.", "Você volta com seus pais sem problema pois seus pais estão acostumados a dirigir com cuidado", "Você sugere voltar dirigindo, já que não bebeu, e sabe dirigir muito bem, apesar de não ter carteira de motorista."], 
[16, 27, 23, 19]);

const q15 = modalFactory(15, "Você e seu amigo começam a planejar sobre como ir até a festa, afinal o local é bem longe da casa de vocês, e precisam escolher o melhor meio afim de sobrar dinheiro para comprar bebida ou condução. Seu amigo então sugere que:", 
["Vocês vão até a parada de ônibus mais próxima.", "Vocês vão de táxi, ficando com pouco dinheiro para gastar na festa", "Você pegue o carro do seu pai escondido, ficando assim com bastante dinheiro para gastar."], 
[18, 22, 20]);

const q16 = modalFactory(16, "Você e seus pais então pedem um táxi, se despedem da sua família e retornam para casa. No caminho, vocês vêm um acidente que aconteceu e se dão conta o quão bom foi ter tomado essa decisão.", 
[], 
[]); 

const q17 = modalFactory(17, "Você decide beber uma cerveja ou duas e mais uns drinks além da conta. Quando você enfim retorna ao seu grupo de amigos, nota que um deles está realmente mal de tanto beber, seus amigos pedem para que você o leve para casa, afinal você está dirigindo essa noite!", 
["Você imediatamente se prontifica a leva-lo para casa, afinal chamar um táxi nessas situações nem sempre é a melhor opção", "Você fala que não, aconselha que peçam um táxi, afinal você fez de tudo pra ir a festa essa noite."],
[21, 31]); 

const q18 = modalFactory(18, "Vocês decidiram então ir de ônibus para não gastar tanto. No caminho, dois sujeitos mal-encarados entram no ônibus e assaltam os passageiros que estão logo na entrada e saem. Por sorte vocês não são o alvo do assalto. Vocês descem na parada e caminham até a festa, lá vocês encontram seus amigos e contam o ocorrido. Um bom tempo se passa lá dentro, vocês estão curtindo de boa, e você nota que todos seus amigos estão bebendo o que você faz?", 
["Você compra bebida", "Você está de boas e não está afim de beber nada alcoólico, quem sabe uma água.", "Você prefere economizar o resto da sua grana e pede para beber o que eles estão bebendo."], 
[30, 22, 30]); 

const q19 = modalFactory(19, "Seu pai aceita você voltar dirigindo, afinal ele lhe ensinou bem. No caminho de volta vocês acabam parando numa blitz. Seu pai é preso por conduta perigosa, já que entregou a direção à menor de idade não habilitado, a pena é aumentada pelo fato de ele ter ingerido álcool, mesmo sendo o único motorista habilitado.", 
[], 
[])

const q20 = modalFactory(20, "Você sabe que seu pai não iria notar caso você saísse com o carro, e de fato, vocês economizariam bastante não pegando táxi. Você espera seus pais irem dormir, pega o carro, e busca seu amigo na casa dele e vão pra festa! Chegando lá você estaciona no local e caminham até a festa, lá vocês encontram seus amigos. Um bom tempo se passa lá dentro, vocês tão curtindo de boa, e você nota que todos seus amigos estão bebendo o que você faz?", 
["Você compra bebida.", "Você está de boas e não está afim de beber nada alcoólico, quem sabe uma água."], 
[17, 26]);

const q21 = modalFactory(21, "Você se prontificou a levar seu amigo pra casa, seus amigos o ajudam a colocar ele no carro. Você está mais atento que o de costume, afinal, você está bêbado e uma blitz ou um acidente agora seria a pior coisa que poderia acontecer. Quando você está voltando da casa do seu amigo onde acabou de deixa-lo, nota que ele deixou um “presente” no banco de trás do carro do seu pai. Sabendo que vai ser uma trabalheira limpar, você nem pensa em retornar à festa. Resta agora rezar para que seu pai não descubra na manhã seguinte que você além de sair com o carro sem pedir, passou parte da noite limpando ele por causa de um amigo bêbado! ", 
[], 
[]);

const q22 = modalFactory(22, "Você compra uma água e volta para seu grupo de amigos. Você nota que seu “crush” está no grupo também, vocês começam a conversar e elx convida você para “fumar um”:", 
["Você aceita o convite e vai com elx pra área de fumantes.", "Você fala que não curte muito e fica com o grupo ali conversando e curtindo a festa. ", "Você não aceita e inclusive decide se afastar da pessoa."], 
[33, 28, 28]); 

const q23 = modalFactory(23, " No caminho para casa, seu pais descuidados e bêbados conversando, não vêm um homem que se encontra à beira da estrada e acabam atingindo-o. Você por estar sóbrio, tem o raciocínio mais rápido então sugere a seu pai que:", 
["Vocês ajudam o homem que foi atropelado, mesmo sabendo que isso traria consequências graves, afinal estava dirigindo bêbado.", "Vocês acelerem e não prestam ajuda a pessoa, afinal, não teriam como descobrir que foram vocês.", " Você assume o volante com o intuito de reduzir a pena/culpa."], 
[32, 29, 25]); 

const q24 = modalFactory(24, "Você e seu amigo decidiram então gastar parte de suas economias pegando um táxi, afinal era o meio mais seguro e simples de chegar a festa. Vocês descem no local e caminham até a festa, lá vocês encontram seus amigos. Um bom tempo se passa lá dentro, vocês tão curtindo de boa, e você nota que todos seus amigos estão bebendo o que você faz?", 
["Você compra bebida.", "Você está de boas e não está afim de beber nada alcoólico, quem sabe uma água.", "Você prefere economizar o resto da sua grana e pede para beber o que eles estão bebendo."], 
[30, 22, 30]);

const q25 = modalFactory(25, "Vocês decidem então chamar por auxílio médico e salvam a vida da pessoa. Você e seu pai acharam que por você ser menor e estar sóbrio a pena seria reduzida, mas é justamente o contrário. Você é processado e cumpre medida socioeducativa. Seu pai é preso por conduta perigosa, já que entregou a direção à menor de idade não habilitado, a pena é aumentada pelo fato de ele ter ingerido álcool, mesmo sendo o único motorista habilitado.",
[], 
[])

const q26 = modalFactory(26, "Você compra uma água e volta para seu grupo de amigos. Se passam algumas horas, você se divertiu bastante, mas notou que já está tarde e procura seu amigo para irem embora. Seu amigo fica na casa dele, e quando você está chegando em casa nota que seu pai o aguarda acordado. Aquela bronca o espera!", 
[], 
[])

const q27 = modalFactory(27, "Você decidiu ficar então, na casa de seus tios, e seus pais voltaram sozinhos. Na manhã seguinte, você acorda com seus tios falando no telefone sobre um acidente que aconteceu na estrada com um casal que dirigia bêbado.", 
[],
[]); 

const q28 = modalFactory(28, "Você passa algumas horas de boas, se diverte bastante, mas nota que já está tarde e procura seu amigo para chamarem um táxi e irem embora. Seu amigo fica na casa dele, e quando você está chegando em casa nota que seu pai o espera acordado. Aquela bronca o espera!", 
[], 
[]); 

const q29 = modalFactory(29, "Você diz para seu pai que é melhor sair dali o quanto antes. No outro dia, vocês vêm no noticiário que houve um acidente em que um motorista não prestou socorro e a vítima que foi atropelada acabou falecendo. É visível a culpa tomando conta de seus pais.", 
[], 
[]); 

const q30 = modalFactory(30, "Você decide beber uma cerveja ou duas e mais uns drinks além da conta. Quando nota que seu crush se aproxima do grupo, vocês começam a conversar e elx convida você para “fumar um”:", 
["Você aceita o convite e vai com elx pra área de fumantes", "Você fala que não curte muito e fica com o grupo ali conversando e curtindo a festa.", "Você não aceita e inclusive decide se afastar da pessoa. "], 
[33, 28, 28]); 

const q31 = modalFactory(31, "Seus amigos chamam um táxi, e mandam ele pra casa. Vocês por outro lado seguem curtindo a noite e bebendo com a grana de sobra por não ter pego táxi. Algumas horas passam e você nota que já é mais que na hora de ir pra casa, principalmente porque precisa levar o carro de volta. Você chama seu amigo e ambos vão embora. No caminho para casa conversando com seu amigo você não percebe, mas uma blitz logo à frente o para. ", 
[], 
[])

const q32 = modalFactory(32, "Vocês decidem então chamar por auxílio médico e salvam a pessoa. Seu pai é preso por dirigir embriagado, o crime é inafiançável e ele vai precisar cumprir a pena.", 
[], 
[])

const q33 = modalFactory(33, "Vocês passam um bom tempo juntos, até que decidem voltar para onde estava o grupo. Passam algumas horas, e já está ficando tarde, seu amigo lhe procura então pra chamarem um táxi e irem embora, afinal, você está na festa escondido de seus pais! A noite foi boa e cheia de histórias pra contar!", 
[], 
[])