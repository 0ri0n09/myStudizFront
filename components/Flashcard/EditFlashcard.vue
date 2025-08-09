<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { Flashcard, FlashcardType } from "~/types/flashcard"
const { isMobile } = useMobile()
import { Loader2 } from "lucide-vue-next"
import { useFlashcard } from "~/services/flashcard/useFlashcard";
import { useCreateFlashcardSingleSchema } from "~/schemas/flashcard/createFlashcardSingle"
import { useCreateFlashcardMultipleSchema } from "~/schemas/flashcard/createFlashcardMultiple";

const props = defineProps<{
  flashcard: Flashcard
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'update:flashcard'): void
}>();

const form = useForm({
  validationSchema: props.flashcard.type === FlashcardType.SINGLE
      ? useCreateFlashcardSingleSchema()
      : useCreateFlashcardMultipleSchema(),
  keepValuesOnUnmount: true
})

watch(() => props.flashcard, (flashcard) => {
  form.setValues({
    ownerId: flashcard.ownerId,
    folderId: flashcard.folderId,
    type: flashcard.type,
    question: flashcard.question,
    tip: flashcard.tip || "",
    note: flashcard.note || "",
    answers: flashcard.type === FlashcardType.SINGLE
        ? { answer: flashcard.answers?.answer || "" }
        : { options: flashcard.answers?.options || [] }
  })
}, { immediate: true })

const editLoading = ref(false)
const onSubmit = form.handleSubmit(async (values) => {
  const formValues = {
    id: props.flashcard.id,
    ownerId: values.ownerId,
    folderId: values.folderId,
    type: values.type,
    question: values.question,
    tip: values.tip || null,
    note: values.note || null,
    answers: values.type === FlashcardType.SINGLE
        ? { answer: values.answers?.answer || "" }
        : { options: values.answers?.options || [] },
  }
  try {
    editLoading.value = true
    await useFlashcard().edit(formValues as Flashcard)
    emit('update:flashcard')
    emit('update:open', false)
  } catch (error) {
    console.error(error)
  } finally {
    editLoading.value = false
    form.resetForm()
  }
})
</script>

<template>
  <Drawer v-bind:open="open" @update:open="emit('update:open', $event)" v-if="isMobile">
    <DrawerContent class="p-2">
      <DrawerHeader>
        <DrawerTitle>Modifier la flashcard</DrawerTitle>
        <DrawerDescription>
          Modifiez les champs ci-dessous
        </DrawerDescription>
      </DrawerHeader>
      <form @submit="onSubmit">
        <!-- Question -->
        <div>
          <FormField v-slot="{ componentField }" name="question">
            <FormItem>
              <FormLabel class="font-semibold">Question</FormLabel>
              <FormControl>
                  <Textarea
                      placeholder="Saisir la question"
                      class="resize-none"
                      v-bind="componentField"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Answers SINGLE -->
        <div v-if="props.flashcard.type === FlashcardType.SINGLE">
          <FormField v-slot="{ value, handleChange }" name="answers">
            <FormItem>
              <FormLabel class="font-semibold">Réponse</FormLabel>
              <FormControl>
                  <Textarea
                      placeholder="Saisir la réponse"
                      class="resize-none"
                      :model-value="value?.answer ?? ''"
                      @update:model-value="val => handleChange({ answer: val })"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Answers MULTIPLE -->
        <div v-if="props.flashcard.type === FlashcardType.MULTIPLE">
          <FormField v-slot="{ value, handleChange }" name="answers.options">
            <FormItem>
              <FormLabel class="font-semibold">Options de réponse</FormLabel>
              <div class="space-y-2">
                <div v-for="(option, index) in (value || [])" :key="index" class="flex items-center gap-2">
                  <FormControl>
                    <Input
                        :placeholder="`Option ${index + 1}`"
                        :model-value="option.answer"
                        @update:model-value="(newValue) => {
                          const newOptions = [...(value || [])];
                          newOptions[index] = { ...newOptions[index], answer: newValue };
                          handleChange(newOptions);
                        }"
                    />
                  </FormControl>
                  <Checkbox
                      :checked="option.isCorrect"
                      @update:checked="(checked) => {
                        const newOptions = [...(value || [])];
                        newOptions[index] = { ...newOptions[index], isCorrect: checked };
                        handleChange(newOptions);
                      }"
                  />
                  <p>Correcte</p>
                  <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      @click="() => {
                        const newOptions = [...(value || [])];
                        newOptions.splice(index, 1);
                        handleChange(newOptions);
                      }"
                  >
                    <Icon icon="mdi:delete" />
                  </Button>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="() => {
                      const newOptions = [...(value || []), { answer: '', isCorrect: false }];
                      handleChange(newOptions);
                    }"
                >
                  <Icon icon="mdi:plus" class="mr-1" />
                  Ajouter une option
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Astuce -->
        <div>
          <FormField v-slot="{ componentField }" name="tip">
            <FormItem>
              <FormLabel class="font-semibold">Astuce (facultatif)</FormLabel>
              <FormControl>
                  <Textarea
                      placeholder="Saisir une astuce"
                      class="resize-none"
                      v-bind="componentField"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Note -->
        <div>
          <FormField v-slot="{ componentField }" name="note">
            <FormItem>
              <FormLabel class="font-semibold">Note (facultatif)</FormLabel>
              <FormControl>
                  <Textarea
                      placeholder="Saisir une note"
                      class="resize-none"
                      v-bind="componentField"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DrawerFooter>

          <!-- Submit -->
          <Button :disabled="editLoading" type="submit">
            <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
            <Icon v-else class="mr-1 size-6" icon="line-md:edit-twotone" />
            <p v-if="!editLoading" class="cursor-pointer">
              Modifier
            </p>
            <p v-else>
              Modification...
            </p>
          </Button>
          <DrawerClose as-child>
            <Button variant="outline">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </form>
    </DrawerContent>
  </Drawer>
  
  <Dialog v-bind:open="open" @update:open="emit('update:open', $event)" v-else>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modifier la flashcard</DialogTitle>
        <DialogDescription>
          Modifiez les champs ci-dessous
        </DialogDescription>
      </DialogHeader>
      <form @submit="onSubmit">
        <div class="space-y-3">
          <!-- Question -->
          <div>
            <FormField v-slot="{ componentField }" name="question">
              <FormItem>
                <FormLabel class="font-semibold">Question</FormLabel>
                <FormControl>
                  <Textarea
                      placeholder="Saisir la question"
                      class="resize-none"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Answers SINGLE -->
          <div v-if="props.flashcard.type === FlashcardType.SINGLE">
            <FormField v-slot="{ value, handleChange }" name="answers">
              <FormItem>
                <FormLabel class="font-semibold">Réponse</FormLabel>
                <FormControl>
                  <Textarea
                      placeholder="Saisir la réponse"
                      class="resize-none"
                      :model-value="value?.answer ?? ''"
                      @update:model-value="val => handleChange({ answer: val })"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Answers MULTIPLE -->
          <div v-if="props.flashcard.type === FlashcardType.MULTIPLE">
            <FormField v-slot="{ value, handleChange }" name="answers.options">
              <FormItem>
                <FormLabel class="font-semibold">Options de réponse</FormLabel>
                <div class="space-y-2">
                  <div v-for="(option, index) in (value || [])" :key="index" class="flex items-center gap-2">
                    <FormControl>
                      <Input
                          :placeholder="`Option ${index + 1}`"
                          :model-value="option.answer"
                          @update:model-value="(newValue) => {
                          const newOptions = [...(value || [])];
                          newOptions[index] = { ...newOptions[index], answer: newValue };
                          handleChange(newOptions);
                        }"
                      />
                    </FormControl>
                    <Checkbox
                        :checked="option.isCorrect"
                        @update:checked="(checked) => {
                        const newOptions = [...(value || [])];
                        newOptions[index] = { ...newOptions[index], isCorrect: checked };
                        handleChange(newOptions);
                      }"
                    />
                    <p>Correcte</p>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        @click="() => {
                        const newOptions = [...(value || [])];
                        newOptions.splice(index, 1);
                        handleChange(newOptions);
                      }"
                    >
                      <Icon icon="mdi:delete" />
                    </Button>
                  </div>
                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      @click="() => {
                      const newOptions = [...(value || []), { answer: '', isCorrect: false }];
                      handleChange(newOptions);
                    }"
                  >
                    <Icon icon="mdi:plus" class="mr-1" />
                    Ajouter une option
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Astuce -->
          <div>
            <FormField v-slot="{ componentField }" name="tip">
              <FormItem>
                <FormLabel class="font-semibold">Astuce (facultatif)</FormLabel>
                <FormControl>
                  <Textarea
                      placeholder="Saisir une astuce"
                      class="resize-none"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Note -->
          <div>
            <FormField v-slot="{ componentField }" name="note">
              <FormItem>
                <FormLabel class="font-semibold">Note (facultatif)</FormLabel>
                <FormControl>
                  <Textarea
                      placeholder="Saisir une note"
                      class="resize-none"
                      v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

        </div>
        <DialogFooter class="mt-4">
          <div class="flex justify-between w-full">
            <DialogClose as-child>
              <Button variant="outlinePrimary">Annuler</Button>
            </DialogClose>

            <!-- Submit -->
            <Button :disabled="editLoading" type="submit">
              <Loader2 v-if="editLoading" class="mr-1 size-6 animate-spin" />
              <Icon v-else class="mr-1 size-6" icon="line-md:edit-twotone" />
              <p v-if="!editLoading" class="cursor-pointer">
                Valider
              </p>
              <p v-else>
                Modification...
              </p>
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>