<script setup lang="ts">
import { Icon } from "@iconify/vue"
const { isMobile } = useMobile()
import { Loader2 } from "lucide-vue-next"
import { useFlashcard } from "~/services/flashcard/useFlashcard";
import { useCreateFlashcardsSchema } from "~/schemas/flashcard/createFlashcards"
import type { UUID } from "node:crypto";
import { toast } from "~/components/ui/toast";

const props = defineProps<{
  open: boolean
  generateWithAI: boolean
  folderId: UUID
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'create:flashcards'): void
}>()

const { data: flashcards } = await useFlashcard().showAll(props.folderId)

const search = ref('')
const filteredFlashcards = computed(() => {
  const query = search.value.toLowerCase()
  return createdFlashcards.value.filter(flashcard =>
      flashcard.question.toLowerCase().includes(query)
  )
})

const form = useForm({
  validationSchema: useCreateFlashcardsSchema(),
  keepValuesOnUnmount: true,
})

const createLoading = ref(false)
const onSubmit = (async () => {
  if (newCreatedFlashcards.value.length === 0) return
  try {
    createLoading.value = true
    await useFlashcard().create(newCreatedFlashcards.value)
  } catch (error) {
    console.error(error)
  } finally {
    createLoading.value = false
    newCreatedFlashcards.value = []
    emit('create:flashcards')
    emit('update:open', false)
  }
})

const isAddFlashcardDisplay = ref(false)
const isAddFlashcardDisplayWithAI = ref<boolean>()

const prompt = ref('')
const openAILoading = ref(false)

const createdFlashcards = ref<any[]>([])
const newCreatedFlashcards = ref<any[]>([])

const carouselIndex = ref(0)

watch(
    () => props.generateWithAI,
    (value) => {
      isAddFlashcardDisplayWithAI.value = value
      isAddFlashcardDisplay.value = !value
    },
    { immediate: true }
)

watchEffect(() => {
  if (flashcards.value) {
    createdFlashcards.value = [...flashcards.value]
  }
})

const newFlashcard = ref({
  question: '',
  answer: '',
  tip: '',
  type: 'SINGLE',
  folderId: props.folderId,
})


function pushToCreateFlashcard() {
  if (!newFlashcard.value.question || !newFlashcard.value.answer) return

  const flashcard = {
    question: newFlashcard.value.question,
    answers: { answer: newFlashcard.value.answer },
    tip: newFlashcard.value.tip || null,
    type: 'SINGLE',
    folderId: props.folderId,
  }
  createdFlashcards.value.unshift(flashcard)
  newCreatedFlashcards.value.push(flashcard)
  newFlashcard.value = {
    question: '',
    answer: '',
    tip: '',
    type: 'SINGLE',
    folderId: props.folderId,
  }
  isAddFlashcardDisplay.value = false
  carouselIndex.value = 0
  toast({
    title: "Flashcard créé !",
    description: "",
    variant: "success",
  });
}

async function pushFlashcardsWithAI() {
  if (!prompt.value) return
  try {
    openAILoading.value = true
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      },
      body: JSON.stringify({
        model: 'o4-mini-2025-04-16',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant pédagogique. Rends uniquement un tableau JSON de flashcards sans texte explicatif.`,
          },
          {
            role: 'user',
            content: `${prompt.value}. Réponds uniquement avec ce format pour des flashcards:
            [
              {
                "question": "Quelle est la capitale de la France ?",
                "answers": { "answer": "Paris" },
                "type": "SINGLE"
              }
            ]`,
          },
        ],
        temperature: 1,
      }),
    })
    const result = await response.json()
    let flashcards = []
    try {
      const rawContent = result.choices?.[0]?.message?.content?.trim() || '[]'
      flashcards = JSON.parse(rawContent)
    } catch (err) {
      console.error('Erreur de parsing JSON', err)
      return
    }

    const formatted = flashcards.map((f: any) => ({
      question: f.question || '',
      answers: f.answers || { answer: '' },
      type: 'SINGLE',
      folderId: props.folderId,
    }))
    createdFlashcards.value.unshift(...formatted)
    newCreatedFlashcards.value.push(...formatted)
    carouselIndex.value = 0
    prompt.value = ''
    isAddFlashcardDisplayWithAI.value = false
    toast({
      title: "Flashcards créés !",
      description: "",
      variant: "success",
    })
  } catch (err) {
    console.error('Erreur lors de l’appel à OpenAI :', err)
  }
  openAILoading.value = false
}
</script>

<template>
  <Drawer v-if="isMobile" v-bind:open="open" @update:open="emit('update:open', $event)">
    <DrawerContent class="max-h-[80vh] min-h-[80vh]">
      <DrawerHeader>
        <DrawerTitle>Ajouter des flashcards</DrawerTitle>
      </DrawerHeader>
      <div class="mx-4">
        <!-- Choix entre manuel ou IA -->
        <div v-if="!isAddFlashcardDisplay && !isAddFlashcardDisplayWithAI" class="text-center mb-2">
          <Button @click="() => { isAddFlashcardDisplay = true; isAddFlashcardDisplayWithAI = false }">
            <Icon icon="line-md:plus" class="size-5 mr-2" />
            <p>Ajouter une flashcard</p>
          </Button>
          <Button class="mt-3 bg-purple-600 hover:bg-purple-500" @click="() => { isAddFlashcardDisplayWithAI = true; isAddFlashcardDisplay = false }">
            <Icon icon="line-md:plus" class="size-5 mr-2" />
            <p>Ajouter des flashcards avec l'IA</p>
          </Button>
        </div>

        <!-- Formulaire manuel -->
        <div v-if="isAddFlashcardDisplay" class="space-y-2">
          <div>
            <p class="font-bold text-xl">Question</p>
            <Textarea v-model="newFlashcard.question" placeholder="Saisir la question" class="resize-none" />
          </div>
          <div>
            <p class="font-bold text-xl">Réponse</p>
            <Textarea v-model="newFlashcard.answer" placeholder="Saisir la réponse" class="resize-none" />
          </div>
          <div>
            <p class="font-bold text-xl">Astuce (optionnel)</p>
            <Textarea v-model="newFlashcard.tip" placeholder="Saisir une astuce" class="resize-none" />
          </div>
          <div class="flex justify-between w-full">
            <Button variant="outlinePrimary" @click="() => { isAddFlashcardDisplay = false; isAddFlashcardDisplayWithAI = false }">
              <Icon icon="line-md:arrow-small-left" class="size-5 mr-2" />
              <p>Retour</p>
            </Button>
            <Button @click="pushToCreateFlashcard">
              <Icon icon="line-md:plus" class="size-5 mr-2" />
              <p>Ajouter la flashcard</p>
            </Button>
          </div>
        </div>

        <!-- Formulaire IA -->
        <div v-if="isAddFlashcardDisplayWithAI" class="space-y-2">
          <div>
            <p class="font-bold text-xl mb-3">Quel genre de flashcards voulez-vous générer ?</p>
            <Textarea :disabled="openAILoading" v-model="prompt" placeholder="Saisir la demande..." />
          </div>
          <div class="flex justify-between w-full">
            <Button variant="outlinePrimary" @click="() => { isAddFlashcardDisplay = false; isAddFlashcardDisplayWithAI = false }">
              <Icon icon="line-md:arrow-small-left" class="size-5 mr-2" />
              <p>Retour</p>
            </Button>
            <Button :disabled="openAILoading" class="bg-purple-600 hover:bg-purple-500" @click="pushFlashcardsWithAI">
              <Icon v-if="!openAILoading" icon="line-md:plus" class="size-5 mr-2" />
              <p v-if="!openAILoading">Générer les flashcards</p>
              <Loader2 v-if="openAILoading" class="size-5 mr-2 animate-spin" />
              <p v-if="openAILoading">Génération des flashcards...</p>
            </Button>
          </div>
        </div>

        <!-- Liste des flashcards (carousel) -->
        <Separator class="my-5" />
        <Carousel v-if="!isAddFlashcardDisplay && !isAddFlashcardDisplayWithAI" orientation="horizontal" v-model="carouselIndex" :opts="{ align: 'start' }">
          <div class="-mb-3">
            <Input v-model="search" :placeholder="isMobile ? 'Rechercher une flashcard...' : 'Rechercher...'" />
          </div>
          <CarouselContent>
            <template v-if="filteredFlashcards.length > 0">
              <CarouselItem v-for="flashcard in filteredFlashcards" :key="flashcard.id" class="pt-3">
                <Flashcard :flashcard="flashcard" class="cursor-pointer" />
              </CarouselItem>
            </template>
            <template v-else>
              <div class="flex items-center justify-center w-full text-center text-muted-foreground">
                Aucune flashcard trouvée
              </div>
            </template>
          </CarouselContent>
          <CarouselPrevious class="-left-4" />
          <CarouselNext class="-right-4" />
        </Carousel>
      </div>

      <!-- Footer -->
      <DrawerFooter>
        <Button :disabled="createLoading || newCreatedFlashcards.length === 0" @click="onSubmit">
          <Loader2 v-if="createLoading" class="mr-1 size-6 animate-spin" />
          <Icon v-else class="mr-1 size-6" icon="basil:add-outline" />
          <p v-if="!createLoading" class="cursor-pointer">Ajouter les flashcards au dossier</p>
          <p v-else>Ajout...</p>
        </Button>
        <DrawerClose as-child>
          <Button variant="outlinePrimary">Annuler</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  <Dialog v-else v-bind:open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="w-[90vw] max-w-8xl max-h-[90vh] min-h-[75vh]">
      <DialogHeader class="mb-2">
        <DialogTitle>Ajouter des flashcards</DialogTitle>
      </DialogHeader>
        <div class="w-full inline-flex h-[65vh]">
          <Carousel orientation="vertical" class="w-2/6 max-w-lg mr-3" v-model="carouselIndex" :opts="{ align: 'start' }">
            <div class="w-5/12 mb-2">
              <Input v-model="search" :placeholder="isMobile ? 'Rechercher...' : 'Rechercher...'" />
            </div>
            <CarouselContent class="max-h-[60vh] min-h-[60vh]">
              <template v-if="filteredFlashcards.length > 0">
                <CarouselItem v-for="flashcard in filteredFlashcards" :key="flashcard.id" class="pt-3">
                  <Flashcard :flashcard="flashcard" class="cursor-pointer" />
                </CarouselItem>
              </template>
              <template v-else>
                <div class="flex items-center justify-center h-[60vh] w-full text-center text-muted-foreground">
                  Aucune flashcard trouvée
                </div>
              </template>
            </CarouselContent>
            <CarouselPrevious class="top-1" />
            <CarouselNext class="-bottom-8" />
          </Carousel>
          <div class="w-4/6 h-full border border-gray-300 rounded-md overflow-auto">
            <div v-if="!isAddFlashcardDisplay && !isAddFlashcardDisplayWithAI" class="mt-48 text-center flex flex-col items-center space-y-2">
              <Button @click="isAddFlashcardDisplay = true">
                <Icon icon="line-md:plus" class="size-5 mr-2" />
                <p>Ajouter une flashcard</p>
              </Button>
              <Button class="bg-purple-600 hover:bg-purple-500" @click="isAddFlashcardDisplayWithAI = true">
                <Icon icon="line-md:plus" class="size-5 mr-2" />
                <p>Ajouter des flashcards avec l'IA</p>
              </Button>
            </div>
            <div v-if="isAddFlashcardDisplay" class="space-y-5 my-10 mx-8">
              <!-- Question -->
              <div>
                <p class="font-bold text-xl">Question</p>
                <Textarea v-model="newFlashcard.question" placeholder="Saisir la question" class="resize-none" />
              </div>

              <!-- Réponse -->
              <div>
                <p class="font-bold text-xl">Réponse</p>
                <Textarea v-model="newFlashcard.answer" placeholder="Saisir la réponse" class="resize-none" />
              </div>

              <!-- Astuce -->
              <div>
                <p class="font-bold text-xl">Astuce (optionnel)</p>
                <Textarea v-model="newFlashcard.tip" placeholder="Saisir une astuce" class="resize-none" />
              </div>

              <!-- Add -->
              <div class="flex justify-between w-full">
                <Button variant="outlinePrimary" @click="isAddFlashcardDisplay = false">
                  <Icon  icon="line-md:arrow-small-left" class="size-5 mr-2" />
                  <p>Retour</p>
                </Button>
                <Button v-if="isAddFlashcardDisplay" @click="pushToCreateFlashcard">
                  <Icon icon="line-md:plus" class="size-5 mr-2" />
                  <p>Ajouter la flashcard</p>
                </Button>
              </div>
            </div>

            <div v-if="isAddFlashcardDisplayWithAI" class="space-y-5 my-10 mx-8">
              <!-- Prompt -->
              <div>
                <p class="font-bold text-xl mb-3">Quel genre de flashcards voulez-vous générer ?</p>
                <Textarea :disabled="openAILoading" v-model="prompt" placeholder="Saisir la demande..." />
              </div>
              <!-- Submit -->
              <div class="flex justify-between w-full">
                <Button variant="outlinePrimary" @click="isAddFlashcardDisplayWithAI = false">
                  <Icon  icon="line-md:arrow-small-left" class="size-5 mr-2" />
                  <p>Retour</p>
                </Button>
                <Button :disabled="openAILoading" class="bg-purple-600 hover:bg-purple-500" @click="pushFlashcardsWithAI">
                  <Icon v-if="!openAILoading" icon="line-md:plus" class="size-5 mr-2" />
                  <p v-if="!openAILoading">Générer les flashcards</p>
                  <Loader2 v-if="openAILoading" class="size-5 mr-2 animate-spin" />
                  <p v-if="openAILoading">Génération des flashcards...</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div class="flex justify-between w-full">
            <DialogClose as-child>
              <Button variant="outlinePrimary">Annuler</Button>
            </DialogClose>
            <!-- Submit -->
            <Button :disabled="createLoading || newCreatedFlashcards.length === 0" @click="onSubmit">
              <Loader2 v-if="createLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="line-md:edit-twotone" />
              <p v-if="!createLoading" class="cursor-pointer">
                Ajouter les flashcards au dossier
              </p>
              <p v-else>
                Ajout des flashcards...
              </p>
            </Button>
          </div>
        </DialogFooter>
    </DialogContent>
  </Dialog>
</template>